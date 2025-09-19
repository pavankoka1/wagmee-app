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

            await SmallcaseGateway.setConfigEnvironment({
                isLeprechaun: false,
                isAmoEnabled: true,
                gatewayName: "wagmee",
                environmentName: SmallcaseGateway.ENV.PROD,
                brokerList: [],
            });

            setDebugInfo(
                "SDK configured successfully, initializing session..."
            );
            console.log("SDK configured successfully, initializing session...");
            await initGatewaySession();
        } catch (err) {
            console.error("Error configuring SDK:", err);
            setError(`Failed to configure SDK: ${err.message || err}`);
            setDebugInfo(`SDK Configuration Error: ${err.message || err}`);
            setLoading(false);
            Alert.alert(
                "SDK Error",
                `Failed to configure SDK: ${err.message || err}`
            );
        }
    };

    const initGatewaySession = useCallback(async () => {
        const jwtToken = getJwtToken();
        try {
            setDebugInfo("Initializing gateway session with JWT token...");
            console.log("Initializing gateway session with JWT token...");

            await SmallcaseGateway.init(jwtToken);
            setIsInitialized(true);

            setDebugInfo(
                "Gateway session initialized, getting transaction ID..."
            );
            console.log(
                "Gateway session initialized, getting transaction ID..."
            );

            const res = await network.get(API_PATHS.getSmallcaseTransactionId);
            console.log("Transaction ID received:", res.transactionId);

            setDebugInfo(
                `Transaction ID received: ${res.transactionId}, starting transaction...`
            );
            await startTransaction(res.transactionId);
        } catch (err) {
            console.error("Error initializing gateway session:", err);
            const errorMessage =
                err.userInfo?.message || err.message || "Unknown error";
            setError(`Failed to initialize gateway session: ${errorMessage}`);
            setDebugInfo(`Gateway Session Error: ${errorMessage}`);
            Alert.alert(
                "Gateway Error",
                `Failed to initialize gateway session: ${errorMessage}`
            );
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
                        "Existing token found, skipping configuration..."
                    );
                    console.log(
                        "Existing SmallCase token found, skipping configuration"
                    );
                    setLoading(false);
                    setIsInitialized(true);
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
