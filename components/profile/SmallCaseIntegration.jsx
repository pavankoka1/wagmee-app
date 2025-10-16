import network from "@/network";
import generateQueryParams from "@/utils/generateQueryParams";
import getJwtToken from "@/utils/getJwtToken";
import replacePlaceholders from "@/utils/replacePlaceholders";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import SmallcaseGateway from "react-native-smallcase-gateway";
import API_PATHS from "../../network/apis";
import { HEADERS_KEYS } from "../../network/constants";

const SmallcaseIntegration = ({ onSuccess, onClose }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const configureSdk = async () => {
        try {
            await SmallcaseGateway.setConfigEnvironment({
                isLeprechaun: false,
                isAmoEnabled: true,
                gatewayName: "wagmee",
                environmentName: SmallcaseGateway.ENV.PROD,
                brokerList: [],
            });
            await initGatewaySession();
        } catch (err) {
            console.error("Error configuring SDK:", err);
            setError("Failed to configure SDK");
            setLoading(false);
            onClose();
        }
    };

    const initGatewaySession = useCallback(async () => {
        try {
            console.log("Starting gateway session initialization...");
            const jwtToken = await getJwtToken();
            console.log("JWT token obtained, initializing SmallCase...");
            await SmallcaseGateway.init(jwtToken);
            console.log("SmallCase initialized successfully");
            setIsInitialized(true);
            console.log("Getting transaction ID from backend...");
            const res = await network.get(API_PATHS.getSmallcaseTransactionId);
            console.log("Transaction ID received:", res.transactionId);
            console.log("Starting transaction...");
            await startTransaction(res.transactionId);
        } catch (err) {
            console.error("Error initializing gateway session:", err.userInfo);
            setError("Failed to initialize gateway session");
            onClose();
        } finally {
            setLoading(false);
        }
    }, []);

    const startTransaction = useCallback(async (transactionId) => {
        try {
            console.log(
                "Triggering SmallCase transaction with ID:",
                transactionId
            );
            const txnResponse = await SmallcaseGateway.triggerTransaction(
                transactionId
            );
            console.log("Transaction response received:", txnResponse);

            // Check if the transaction was successful
            if (!txnResponse.success) {
                throw new Error("Smallcase transaction failed");
            }

            // Handle different data formats between iOS and Android
            let smallcaseAuthToken;
            if (typeof txnResponse.data === "string") {
                // Android returns data as JSON string
                const parsedData = JSON.parse(txnResponse.data);
                smallcaseAuthToken = parsedData.smallcaseAuthToken;
            } else {
                // iOS returns data as object
                smallcaseAuthToken = txnResponse.data.smallcaseAuthToken;
            }
            console.log("Auth token extracted:", smallcaseAuthToken);

            // Store the auth token for future use (only if we have a valid token)
            if (smallcaseAuthToken) {
                await SecureStore.setItemAsync(
                    HEADERS_KEYS.SMALLCASE_AUTH_TOKEN,
                    smallcaseAuthToken
                );
                console.log("Auth token stored successfully");
            } else {
                console.log("No auth token to store");
            }

            const userId = await SecureStore.getItemAsync(HEADERS_KEYS.USER_ID);
            console.log("User ID:", userId);

            // Try to fetch holdings, but don't fail the entire flow if it fails
            try {
                const holdingsPath = generateQueryParams(
                    replacePlaceholders(API_PATHS.getHoldings, userId),
                    {
                        gatewayAuthToken: smallcaseAuthToken,
                    }
                );
                console.log("Holdings path:", holdingsPath);
                console.log("Auth token being sent:", smallcaseAuthToken);

                const holdingsResponse = await network.get(holdingsPath);
                console.log("Holdings fetched successfully:", holdingsResponse);
            } catch (holdingsError) {
                console.log("Holdings API error:", holdingsError);
                console.log(
                    "Holdings API error response:",
                    holdingsError.response?.data
                );
                console.log(
                    "Holdings API error status:",
                    holdingsError.response?.status
                );
                console.log("Continuing despite holdings fetch failure...");
                // The Smallcase integration was successful, so we should still call onSuccess
            }

            // Always call onSuccess since the Smallcase transaction was successful
            console.log("Smallcase integration completed successfully");
            onSuccess();
        } catch (err) {
            console.log("Transaction error:", err);
            console.log("Error details:", err.userInfo || err.message || err);
            setError("Failed to complete Smallcase integration");
            onClose();
        }
    }, []);

    useEffect(() => {
        const checkAuthToken = async () => {
            const token = await SecureStore.getItemAsync(
                HEADERS_KEYS.SMALLCASE_AUTH_TOKEN
            );
            if (!token) {
                await configureSdk();
            } else {
                // Even with existing token, we need to initialize and start transaction
                await configureSdk();
            }
        };
        checkAuthToken();
    }, []);

    return (
        <View className="flex-1 justify-center items-center relative bg-[#161616]">
            {loading && (
                <View className="absolute inset-0 bg-white opacity-75 flex justify-center items-center">
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
            {isInitialized ? (
                <Text className="text-white">
                    Gateway session initialized successfully!
                </Text>
            ) : (
                <Text className="text-white">
                    Initializing gateway session...
                </Text>
            )}
            {error && <Text className="text-red-500">{error}</Text>}
            <TouchableOpacity
                onPress={onClose}
                className="absolute top-4 right-4"
            >
                <Text className="text-white">Close</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SmallcaseIntegration;
