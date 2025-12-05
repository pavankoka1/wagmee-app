import { View, TouchableOpacity, Text } from "react-native";
import React, { useState } from "react";
import Header from "./Header";
import Card from "./Card";
import TabButton from "@/components/Tabs/TabButton";
import SmallcaseIntegration from "./SmallCaseIntegration";
import ZeroScreen from "./ZeroScreen";
import StocksList from "./StocksList";
import PortfolioCopilotModal from "./PortfolioCopilotModal";

const Portfolio = ({ handleTabChange }) => {
    const [isIntegrationVisible, setIntegrationVisible] = useState(false);
    const [isPortfolioConnected, setPortfolioConnected] = useState(true);
    const [isCopilotOpen, setIsCopilotOpen] = useState(false);

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
            <View>
                <Card />
                <View className="px-4 mt-4 mb-2 flex-row justify-end">
                    <TouchableOpacity
                        onPress={() => setIsCopilotOpen(true)}
                        className="flex-row items-center px-4 py-2.5 rounded-xl border border-[#2A2A2A]"
                        style={{
                            backgroundColor: "#1F1F1F",
                            shadowColor: "#b4ef02",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                        }}
                    >
                        <View className="bg-[#b4ef02]/20 rounded-full p-1.5 mr-2">
                            <Text className="text-[#b4ef02] text-xs">✨</Text>
                        </View>
                        <View>
                            <Text className="font-manrope-bold text-12 text-white">
                                AI Summary
                            </Text>
                            <Text className="font-manrope-medium text-10 text-[#B1B1B1]">
                                Portfolio Copilot
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
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
            <PortfolioCopilotModal
                visible={isCopilotOpen}
                onClose={() => setIsCopilotOpen(false)}
            />
        </View>
    );
};

export default Portfolio;
