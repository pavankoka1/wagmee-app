import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import SmallcaseGateway from "react-native-smallcase-gateway";
import * as SecureStore from "expo-secure-store";
import getJwtToken from "@/utils/getJwtToken";
import network from "@/network";
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
        const jwtToken = getJwtToken();
        try {
            await SmallcaseGateway.init(jwtToken);
            setIsInitialized(true);
            const res = await network.get(API_PATHS.getSmallcaseTransactionId);
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
            const txnResponse = await SmallcaseGateway.triggerTransaction(
                transactionId
            );
            const smallcaseAuthToken = JSON.parse(
                txnResponse.data
            ).smallcaseAuthToken;
            await SecureStore.setItemAsync(
                HEADERS_KEYS.SMALLCASE_AUTH_TOKEN,
                smallcaseAuthToken
            );
            onSuccess();
        } catch (err) {
            console.log("Transaction error:", err.userInfo);
            onClose();
        }
    }, []);

    useEffect(() => {
        const checkAuthToken = async () => {
            const token = await SecureStore.getItem(
                HEADERS_KEYS.SMALLCASE_AUTH_TOKEN
            );
            if (!token) {
                await configureSdk();
            } else {
                setLoading(false);
                setIsInitialized(true);
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
