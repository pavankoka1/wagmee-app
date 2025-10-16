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

            const smallcaseAuthToken = JSON.parse(
                txnResponse.data
            ).smallcaseAuthToken;
            console.log("Auth token extracted:", smallcaseAuthToken);

            const userId = await SecureStore.getItemAsync(HEADERS_KEYS.USER_ID);
            console.log("User ID:", userId);

            const holdingsPath = generateQueryParams(
                replacePlaceholders(API_PATHS.getHoldings, userId),
                {
                    gatewayAuthToken: smallcaseAuthToken,
                }
            );
            console.log("Holdings path:", holdingsPath);

            await network.get(holdingsPath);
            console.log("Holdings fetched successfully");

            onSuccess();
        } catch (err) {
            console.log("Transaction error:", err.userInfo);
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
