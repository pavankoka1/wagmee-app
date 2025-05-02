import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import Header from "./Header";
import Card from "./Card";
import TabButton from "@/components/Tabs/TabButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import SmallcaseIntegration from "./SmallCaseIntegration";
import { HEADERS_KEYS } from "../../network/constants";
import * as SecureStore from "expo-secure-store";
import ZeroScreen from "./ZeroScreen";
import StocksList from "./StocksList";

const Portfolio = ({ handleTabChange }) => {
    const [isIntegrationVisible, setIntegrationVisible] = useState(false);
    const [isPortfolioConnected, setPortfolioConnected] = useState(false);

    // Function to check token and update state
    const checkToken = useCallback(async () => {
        try {
            const token = await SecureStore.getItemAsync(
                HEADERS_KEYS.SMALLCASE_AUTH_TOKEN
            );
            console.log("Token from Smallcase:", token);
            setPortfolioConnected(!!token); // Update state based on token presence
            return token;
        } catch (error) {
            console.error("Error fetching token:", error);
            return null;
        }
    }, []);

    // Check token on component mount
    useEffect(() => {
        checkToken();
    }, [checkToken]);

    // Handle portfolio connection
    const handleConnectPortfolio = async () => {
        const token = await checkToken();
        if (!token) {
            setIntegrationVisible(true);
        }
    };

    // Handle SmallcaseIntegration closure
    const handleIntegrationClose = async () => {
        setIntegrationVisible(false);
        await checkToken(); // Re-check token after integration flow
    };

    return (
        <View className="flex-1 bg-[#161616]">
            <Header />
            <Card />
            {isPortfolioConnected && (
                <StocksList
                    onClose={() => {
                        setPortfolioConnected(false);
                        SecureStore.deleteItemAsync(
                            HEADERS_KEYS.SMALLCASE_AUTH_TOKEN
                        );
                    }}
                />
            )}
            {!isPortfolioConnected && !isIntegrationVisible && (
                <ZeroScreen
                    handleTabChange={handleTabChange}
                    handleConnectPortfolio={handleConnectPortfolio}
                />
            )}
            {isIntegrationVisible && (
                <SmallcaseIntegration
                    onClose={handleIntegrationClose}
                    onSuccess={() => {
                        setIntegrationVisible(false);
                        setPortfolioConnected(true);
                    }}
                />
            )}
        </View>
    );
};

export default Portfolio;
