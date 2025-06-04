import { View } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import Header from "./Header";
import Card from "./Card";
import TabButton from "@/components/Tabs/TabButton";
import SmallcaseIntegration from "./SmallCaseIntegration";
import { HEADERS_KEYS } from "../../network/constants";
import * as SecureStore from "expo-secure-store";
import ZeroScreen from "./ZeroScreen";
import StocksList from "./StocksList";

const Portfolio = ({ handleTabChange }) => {
    const [isIntegrationVisible, setIntegrationVisible] = useState(false);
    const [isPortfolioConnected, setPortfolioConnected] = useState(true);

    // Handle portfolio connection
    const handleConnectPortfolio = async () => {
        setIntegrationVisible(true);
    };

    // Handle SmallcaseIntegration closure
    const handleIntegrationClose = async () => {
        setIntegrationVisible(false);
    };

    return (
        <View className="flex-1 bg-[#161616]">
            <Header />
            <Card />
            <View className="flex flex-row border-b-[2px] border-[#1F2023]">
                <TabButton
                    title="Portfolio"
                    className="border-b-[3px] border-primary-main pb-5"
                    isActive={true}
                />
                <TabButton title="Posts" onPress={handleTabChange} />
            </View>
            {isPortfolioConnected && (
                <StocksList
                    onClose={() => {
                        setPortfolioConnected(false);
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
