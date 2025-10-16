import React, { useState } from "react";
import { View } from "react-native";
import SmallcaseIntegration from "./SmallCaseIntegration";
import StocksList from "./StocksList";
import ZeroScreen from "./ZeroScreen";

const PortfolioContent = ({
    Header,
    Card,
    TabButton,
    activeTab,
    onTabChange,
}) => {
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
            {/* Portfolio Content */}
            {isPortfolioConnected && (
                <StocksList
                    onClose={() => {
                        setPortfolioConnected(false);
                    }}
                    Header={Header}
                    Card={Card}
                    TabButton={TabButton}
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                />
            )}
            {!isPortfolioConnected && !isIntegrationVisible && (
                <View className="flex-1">
                    {/* Shared Header */}
                    <Header />

                    {/* Shared Card */}
                    <Card />

                    {/* Shared Tab Navigation */}
                    <View className="flex flex-row border-b-[2px] border-[#1F2023]">
                        <TabButton
                            title="Portfolio"
                            className={
                                activeTab === "portfolio"
                                    ? "border-b-[3px] border-primary-main pb-5"
                                    : ""
                            }
                            isActive={activeTab === "portfolio"}
                            onPress={() => onTabChange("portfolio")}
                        />
                        <TabButton
                            title="Posts"
                            className={
                                activeTab === "posts"
                                    ? "border-b-[3px] border-primary-main pb-5"
                                    : ""
                            }
                            isActive={activeTab === "posts"}
                            onPress={() => onTabChange("posts")}
                        />
                    </View>

                    <ZeroScreen
                        handleTabChange={() => {}} // No longer needed since tab is managed in parent
                        handleConnectPortfolio={handleConnectPortfolio}
                    />
                </View>
            )}
            {isIntegrationVisible && (
                <View className="flex-1">
                    {/* Shared Header */}
                    <Header />

                    {/* Shared Card */}
                    <Card />

                    {/* Shared Tab Navigation */}
                    <View className="flex flex-row border-b-[2px] border-[#1F2023]">
                        <TabButton
                            title="Portfolio"
                            className={
                                activeTab === "portfolio"
                                    ? "border-b-[3px] border-primary-main pb-5"
                                    : ""
                            }
                            isActive={activeTab === "portfolio"}
                            onPress={() => onTabChange("portfolio")}
                        />
                        <TabButton
                            title="Posts"
                            className={
                                activeTab === "posts"
                                    ? "border-b-[3px] border-primary-main pb-5"
                                    : ""
                            }
                            isActive={activeTab === "posts"}
                            onPress={() => onTabChange("posts")}
                        />
                    </View>

                    <SmallcaseIntegration
                        onClose={handleIntegrationClose}
                        onSuccess={() => {
                            setIntegrationVisible(false);
                            setPortfolioConnected(true);
                        }}
                    />
                </View>
            )}
        </View>
    );
};

export default React.memo(PortfolioContent);
