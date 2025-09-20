import network from "@/network";
import generateQueryParams from "@/utils/generateQueryParams";
import getJwtToken from "@/utils/getJwtToken";
import replacePlaceholders from "@/utils/replacePlaceholders";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import SmallcaseGateway from "react-native-smallcase-gateway";
import API_PATHS from "../../network/apis";
import { HEADERS_KEYS } from "../../network/constants";

const SmallcaseIntegration = ({ onSuccess, onClose }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [transactionState, setTransactionState] = useState("idle"); // idle, processing, success, error
    const [debugInfo, setDebugInfo] = useState("");

    const configureSdk = async () => {
        try {
            setDebugInfo("Configuring SmallCase SDK...");
            console.log("Configuring SmallCase SDK...");

            // Configure SmallCase SDK for both platforms (fixed iOS BOOL* bug)
            console.log(
                "Configuring SmallCase with gateway: wagmee, environment: PROD"
            );
            await SmallcaseGateway.setConfigEnvironment({
                isLeprechaun: false,
                isAmoEnabled: true,
                gatewayName: "wagmee",
                environmentName: SmallcaseGateway.ENV.PROD,
                brokerList: [],
            });
            console.log("SmallCase configuration completed successfully");

            setDebugInfo(
                "SDK configured successfully, initializing session..."
            );
            console.log("SDK configured successfully, initializing session...");
            await initGatewaySession();
        } catch (err) {
            console.error("Error configuring SDK:", err);
            const errorMsg = `Failed to configure SDK: ${err.message || err}`;
            setError(errorMsg);
            setDebugInfo(`SDK Configuration Error: ${err.message || err}`);
            setLoading(false);
            Alert.alert("SDK Error", errorMsg);
        }
    };

    const initGatewaySession = useCallback(async () => {
        try {
            setDebugInfo("Initializing gateway session with JWT token...");
            console.log("Initializing gateway session with JWT token...");

            // Validate that user is logged in before proceeding
            const userId = await SecureStore.getItemAsync(HEADERS_KEYS.USER_ID);
            if (!userId) {
                throw new Error(
                    "User authentication required. Please log in to use SmallCase integration."
                );
            }

            const jwtToken = await getJwtToken();
            console.log("JWT token generated successfully for user:", userId);

            // Log JWT payload for debugging (without the signature)
            try {
                const jwtParts = jwtToken.split(".");
                if (jwtParts.length >= 2) {
                    const payload = JSON.parse(atob(jwtParts[1]));
                    console.log("JWT payload:", {
                        userId: payload.userId,
                        email: payload.email ? "present" : "missing",
                        name: payload.name ? "present" : "missing",
                        iat: payload.iat,
                        exp: payload.exp,
                    });

                    // Check if user data is missing and provide guidance
                    if (!payload.email || !payload.name) {
                        console.warn(
                            "SmallCase JWT missing user data. User needs to re-authenticate."
                        );
                        throw new Error(
                            "SmallCase requires complete user information. Please log out and log back in to refresh your session, then try again."
                        );
                    }
                }
            } catch (decodeError) {
                if (decodeError.message.includes("re-authenticate")) {
                    throw decodeError; // Re-throw our custom error
                }
                console.warn(
                    "Could not decode JWT for debugging:",
                    decodeError
                );
            }

            console.log("Calling SmallcaseGateway.init() with JWT token...");
            await SmallcaseGateway.init(jwtToken);
            console.log("SmallcaseGateway.init() completed successfully");
            setIsInitialized(true);

            setDebugInfo(
                "Gateway session initialized, getting transaction ID..."
            );
            console.log(
                "Gateway session initialized, getting transaction ID..."
            );

            const res = await network.get(API_PATHS.getSmallcaseTransactionId);
            console.log("Transaction ID received:", res.transactionId);

            if (!res.transactionId) {
                throw new Error(
                    "Failed to get transaction ID from backend. Please check SmallCase API integration."
                );
            }

            setDebugInfo(
                `Transaction ID received: ${res.transactionId}, starting transaction...`
            );
            await startTransaction(res.transactionId);
        } catch (err) {
            console.error("Error initializing gateway session:", err);
            const errorMessage =
                err.userInfo?.message || err.message || "Unknown error";

            let finalErrorMessage;
            if (errorMessage.includes("User authentication required")) {
                finalErrorMessage =
                    "Please log in to your account before using SmallCase integration.";
            } else if (
                errorMessage.includes(
                    "Failed to generate SmallCase authentication token"
                )
            ) {
                finalErrorMessage =
                    "SmallCase authentication failed. Please contact support if the issue persists.";
            } else if (
                errorMessage.includes("re-authenticate") ||
                errorMessage.includes("complete user information")
            ) {
                finalErrorMessage =
                    "SmallCase requires complete user profile information. Please log out and log back in to refresh your session, then try SmallCase integration again.";
            } else if (errorMessage.includes("SmallCase private key")) {
                finalErrorMessage =
                    "SmallCase configuration error: Private key not configured. Please set EXPO_PUBLIC_SMALLCASE_PRIVATEKEY environment variable with your SmallCase secret key.";
            } else if (
                errorMessage.toLowerCase().includes("error during init")
            ) {
                finalErrorMessage =
                    "SmallCase authentication failed. Possible causes:\n" +
                    "• Invalid SmallCase private key\n" +
                    "• Gateway 'wagmee' not registered with SmallCase\n" +
                    "• JWT token rejected by SmallCase backend\n\n" +
                    "Please verify your SmallCase credentials and gateway registration.";
            } else {
                finalErrorMessage = `Failed to initialize gateway session: ${errorMessage}`;
            }

            setError(finalErrorMessage);
            setDebugInfo(`Gateway Session Error: ${errorMessage}`);
            Alert.alert("Gateway Error", finalErrorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const startTransaction = useCallback(async (transactionId) => {
        try {
            setTransactionState("processing");
            setDebugInfo("Starting SmallCase transaction...");
            console.log(
                "Starting SmallCase transaction with ID:",
                transactionId
            );

            const txnResponse = await SmallcaseGateway.triggerTransaction(
                transactionId
            );

            console.log("Transaction response:", txnResponse);
            setDebugInfo("Transaction triggered, processing response...");

            const smallcaseAuthToken = JSON.parse(
                txnResponse.data
            ).smallcaseAuthToken;

            console.log("SmallCase auth token received:", smallcaseAuthToken);
            setDebugInfo("Auth token received, fetching user ID...");

            // Get userId from SecureStore
            const userId = await SecureStore.getItemAsync(HEADERS_KEYS.USER_ID);
            if (!userId) {
                throw new Error("User ID not found in secure storage");
            }

            console.log("User ID retrieved:", userId);
            setDebugInfo(`User ID retrieved: ${userId}, fetching holdings...`);

            const holdingsPath = generateQueryParams(
                replacePlaceholders(API_PATHS.getHoldings, userId),
                {
                    gatewayAuthToken: smallcaseAuthToken,
                }
            );

            console.log("Holdings API path:", holdingsPath);
            const holdingsResponse = await network.get(holdingsPath);
            console.log("Holdings response:", holdingsResponse);

            setDebugInfo(
                "Holdings fetched successfully, transaction completed!"
            );
            setTransactionState("success");

            // Store the auth token for future use
            await SecureStore.setItemAsync(
                HEADERS_KEYS.SMALLCASE_AUTH_TOKEN,
                smallcaseAuthToken
            );

            onSuccess();
        } catch (err) {
            console.error("Transaction error:", err);
            const errorMessage =
                err.userInfo?.message ||
                err.message ||
                "Unknown transaction error";
            setError(`Transaction failed: ${errorMessage}`);
            setDebugInfo(`Transaction Error: ${errorMessage}`);
            setTransactionState("error");
            Alert.alert(
                "Transaction Error",
                `Transaction failed: ${errorMessage}`
            );
        }
    }, []);

    useEffect(() => {
        const checkAuthToken = async () => {
            try {
                setDebugInfo("Checking for existing SmallCase auth token...");
                const token = await SecureStore.getItemAsync(
                    HEADERS_KEYS.SMALLCASE_AUTH_TOKEN
                );
                if (!token) {
                    setDebugInfo(
                        "No existing token found, starting fresh configuration..."
                    );
                    await configureSdk();
                } else {
                    setDebugInfo(
                        "Existing token found, proceeding with gateway initialization..."
                    );
                    console.log(
                        "Existing SmallCase token found, proceeding with initialization"
                    );
                    // Even with existing token, we need to initialize gateway and start transaction
                    await configureSdk();
                }
            } catch (err) {
                console.error("Error checking auth token:", err);
                setError(`Error checking auth token: ${err.message}`);
                setLoading(false);
            }
        };
        checkAuthToken();
    }, []);

    return (
        <View className="flex-1 justify-center items-center relative bg-[#161616] p-4">
            {loading && (
                <View className="absolute inset-0 bg-white opacity-75 flex justify-center items-center">
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

            <View className="flex-1 justify-center items-center">
                {isInitialized ? (
                    <View className="items-center">
                        <Text className="text-white text-lg mb-2">
                            Gateway session initialized successfully!
                        </Text>
                        {transactionState === "processing" && (
                            <Text className="text-yellow-400 text-sm mb-2">
                                Processing transaction...
                            </Text>
                        )}
                        {transactionState === "success" && (
                            <Text className="text-green-400 text-sm mb-2">
                                Transaction completed successfully!
                            </Text>
                        )}
                    </View>
                ) : (
                    <Text className="text-white text-lg mb-2">
                        Initializing gateway session...
                    </Text>
                )}

                {error && (
                    <View className="bg-red-900 p-3 rounded-lg mb-4 max-w-full">
                        <Text className="text-red-300 text-sm text-center">
                            {error}
                        </Text>
                    </View>
                )}

                {debugInfo && (
                    <View className="bg-gray-800 p-3 rounded-lg mb-4 max-w-full">
                        <Text className="text-gray-300 text-xs text-center">
                            Debug: {debugInfo}
                        </Text>
                    </View>
                )}

                <View className="flex-row space-x-4">
                    <TouchableOpacity
                        onPress={onClose}
                        className="bg-gray-600 px-4 py-2 rounded-lg"
                    >
                        <Text className="text-white">Close</Text>
                    </TouchableOpacity>

                    {error && (
                        <TouchableOpacity
                            onPress={() => {
                                setError(null);
                                setDebugInfo("");
                                setTransactionState("idle");
                                configureSdk();
                            }}
                            className="bg-blue-600 px-4 py-2 rounded-lg"
                        >
                            <Text className="text-white">Retry</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

export default SmallcaseIntegration;
