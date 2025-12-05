import network from "@/network";
import API_PATHS from "@/network/apis";
import replacePlaceholders from "@/utils/replacePlaceholders";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import PortfolioCopilotModal from "./PortfolioCopilotModal";
import StockItem from "./StockItem";

const { width } = Dimensions.get("window");

const UserProfilePortfolio = ({ userId }) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState("overall"); // "today" or "overall"
    const togglePosition = useSharedValue(0); // 0 for "overall", 1 for "today"
    const [isCopilotOpen, setIsCopilotOpen] = useState(false);

    useEffect(() => {
        const fetchHoldings = async () => {
            try {
                setIsLoading(true);
                const response = await network.get(
                    replacePlaceholders(API_PATHS.getHoldings, userId)
                );
                setData(response.data);
                setError(null);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchHoldings();
        }
    }, [userId]);

    const toggleViewMode = () => {
        const newMode = viewMode === "overall" ? "today" : "overall";
        setViewMode(newMode);
        togglePosition.value = withTiming(newMode === "today" ? 1 : 0, {
            duration: 200,
            easing: Easing.inOut(Easing.ease),
        });
    };

    const animatedToggleStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX:
                    togglePosition.value * (width * 0.25 - width * 0.115 - 4), // Proper calculation: container width - toggle width - padding
            },
        ],
    }));

    const renderToggleButton = () => (
        <TouchableOpacity
            onPress={toggleViewMode}
            className="bg-[#2A2B2E] rounded-full flex-row items-center"
            style={{ width: width * 0.25, height: 32 }}
        >
            <Animated.View
                className="absolute bg-[#b4ef02] rounded-full"
                style={[
                    {
                        width: width * 0.115,
                        height: 26,
                        left: 2,
                    },
                    animatedToggleStyle,
                ]}
            />
            <View className="flex-row justify-between items-center flex-1 px-3">
                <Text
                    className={clsx(
                        "text-xs font-medium",
                        viewMode === "overall"
                            ? "text-[#161616]"
                            : "text-[#b1b1b1]"
                    )}
                >
                    Overall
                </Text>
                <Text
                    className={clsx(
                        "text-xs font-medium",
                        viewMode === "today"
                            ? "text-[#161616]"
                            : "text-[#b1b1b1]"
                    )}
                >
                    Today
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderHeader = () => {
        if (isLoading) {
            return (
                <View className="px-4 pt-4">
                    {/* AI Summary Button */}
                    <View className="mb-3 flex-row justify-end">
                        <TouchableOpacity
                            disabled
                            className="flex-row items-center px-4 py-2.5 rounded-xl border border-[#2A2A2A] opacity-50"
                            style={{
                                backgroundColor: "#1F1F1F",
                            }}
                        >
                            <View className="bg-[#b4ef02]/20 rounded-full p-1.5 mr-2">
                                <Text className="text-[#b4ef02] text-xs">
                                    ✨
                                </Text>
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
                    {/* Toggle Button */}
                    <View className="mb-3 flex-row justify-end">
                        {renderToggleButton()}
                    </View>
                    <View className="bg-[#1F2023] p-4 rounded-lg shadow-md">
                        <View className="flex-row justify-between">
                            <View>
                                <Text className="text-[#b1b1b1] text-xs tracking-wide">
                                    Invested
                                </Text>
                                <View className="h-5 w-24 bg-[#2A2B2E] rounded mt-1 animate-pulse" />
                            </View>
                            <View className="items-end">
                                <Text className="text-[#b1b1b1] text-xs tracking-wide">
                                    Current
                                </Text>
                                <View className="h-5 w-24 bg-[#2A2B2E] rounded mt-1 animate-pulse" />
                            </View>
                        </View>
                        <View className="border-t border-[#2A2B2E] mt-3 pt-3">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-[#b1b1b1] text-xs tracking-wide">
                                    {viewMode === "today"
                                        ? "P&L (today)"
                                        : "P&L"}
                                </Text>
                                <View className="h-5 w-32 bg-[#2A2B2E] rounded animate-pulse" />
                            </View>
                        </View>
                    </View>
                </View>
            );
        }

        if (!data) return null;

        // Calculate totals
        const totalInvested = data.totalInvestedAmount;
        const totalCurrent = data.totalCurrentAmount;
        const totalChange = totalCurrent - totalInvested;
        const totalChangePercentage = (totalChange / totalInvested) * 100;

        return (
            <View className="px-4 pt-2">
                {/* AI Summary Button */}
                <View className="mb-4 flex-row justify-end">
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
                {/* Toggle Button */}
                <View className="mb-3 flex-row justify-end">
                    {renderToggleButton()}
                </View>
                <View className="bg-[#1F2023] p-4 rounded-lg shadow-md">
                    <View className="flex-row justify-between">
                        <View>
                            <Text className="text-[#b1b1b1] text-xs tracking-wide">
                                Invested
                            </Text>
                            <Text className="text-white text-base font-semibold mt-1">
                                ₹
                                {totalInvested.toLocaleString("en-IN", {
                                    maximumFractionDigits: 2,
                                })}
                            </Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-[#b1b1b1] text-xs tracking-wide">
                                Current
                            </Text>
                            <Text className="text-white text-base font-semibold mt-1">
                                ₹
                                {totalCurrent.toLocaleString("en-IN", {
                                    maximumFractionDigits: 2,
                                })}
                            </Text>
                        </View>
                    </View>

                    <View className="border-t border-[#2A2B2E] mt-3 pt-3">
                        <View className="flex-row justify-between items-center">
                            <Text className="text-[#b1b1b1] text-xs tracking-wide">
                                {viewMode === "today" ? "P&L (today)" : "P&L"}
                            </Text>
                            {viewMode === "today" ? (
                                (() => {
                                    // Calculate today's P&L from all stocks
                                    let totalTodayPnL = 0;
                                    let totalTodayPercentage = 0;

                                    if (data?.securities) {
                                        data.securities.forEach((item) => {
                                            let todayProfitLoss = 0;
                                            let todayPercentageChange = 0;

                                            if (
                                                item.dayChange &&
                                                item.holdings.quantity &&
                                                Number(item.dayChange) !== 0
                                            ) {
                                                todayProfitLoss =
                                                    Number(item.dayChange) *
                                                    Number(
                                                        item.holdings.quantity
                                                    );
                                                todayPercentageChange =
                                                    item.dayChangePercentage ||
                                                    0;
                                            } else if (
                                                item.dayChangePercentage &&
                                                item.holdings.quantity &&
                                                item.currentPrice
                                            ) {
                                                const yesterdayClosePrice =
                                                    Number(item.currentPrice) /
                                                    (1 +
                                                        Number(
                                                            item.dayChangePercentage
                                                        ) /
                                                            100);
                                                const actualDayChange =
                                                    Number(item.currentPrice) -
                                                    yesterdayClosePrice;
                                                todayProfitLoss =
                                                    actualDayChange *
                                                    Number(
                                                        item.holdings.quantity
                                                    );
                                                todayPercentageChange = Number(
                                                    item.dayChangePercentage
                                                );
                                            } else if (
                                                item.currentPrice &&
                                                item.holdings.averagePrice &&
                                                item.holdings.quantity
                                            ) {
                                                const overallChange =
                                                    Number(item.currentPrice) -
                                                    Number(
                                                        item.holdings
                                                            .averagePrice
                                                    );
                                                const estimatedTodayChange =
                                                    overallChange * 0.15;
                                                todayProfitLoss =
                                                    estimatedTodayChange *
                                                    Number(
                                                        item.holdings.quantity
                                                    );
                                                todayPercentageChange =
                                                    (estimatedTodayChange /
                                                        Number(
                                                            item.holdings
                                                                .averagePrice
                                                        )) *
                                                    100;
                                            }

                                            totalTodayPnL += todayProfitLoss;
                                            totalTodayPercentage +=
                                                todayPercentageChange;
                                        });
                                    }

                                    const avgTodayPercentage =
                                        totalTodayPnL !== 0
                                            ? totalTodayPercentage /
                                              (data.securities?.length || 1)
                                            : 0;

                                    return (
                                        <Text
                                            className={clsx(
                                                "text-base font-semibold",
                                                totalTodayPnL >= 0
                                                    ? "text-[#22c55e]"
                                                    : "text-[#ef4444]"
                                            )}
                                        >
                                            {totalTodayPnL >= 0 ? "+" : "-"}₹
                                            {Math.abs(
                                                totalTodayPnL
                                            ).toLocaleString("en-IN", {
                                                maximumFractionDigits: 2,
                                            })}{" "}
                                            <Text
                                                className={clsx(
                                                    "text-xs",
                                                    totalTodayPnL >= 0
                                                        ? "text-[#22c55e]"
                                                        : "text-[#ef4444]"
                                                )}
                                            >
                                                ({totalTodayPnL >= 0 ? "+" : ""}
                                                {Math.abs(
                                                    avgTodayPercentage
                                                ).toFixed(2)}
                                                %)
                                            </Text>
                                        </Text>
                                    );
                                })()
                            ) : (
                                <Text
                                    className={clsx(
                                        "text-base font-semibold",
                                        totalChange >= 0
                                            ? "text-[#22c55e]"
                                            : "text-[#ef4444]"
                                    )}
                                >
                                    {totalChange >= 0 ? "+" : "-"}₹
                                    {Math.abs(totalChange).toLocaleString(
                                        "en-IN",
                                        {
                                            maximumFractionDigits: 2,
                                        }
                                    )}{" "}
                                    <Text
                                        className={clsx(
                                            "text-xs",
                                            totalChange >= 0
                                                ? "text-[#22c55e]"
                                                : "text-[#ef4444]"
                                        )}
                                    >
                                        ({totalChangePercentage >= 0 ? "+" : ""}
                                        {totalChangePercentage.toFixed(2)}%)
                                    </Text>
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderListContent = () => {
        if (isLoading) {
            return (
                <View className="px-4">
                    {[...Array(5)].map((_, index) => (
                        <View
                            key={index}
                            className="flex-row justify-between border-b-[2px] border-[#1F2023] p-4"
                        >
                            <View className="flex-1">
                                <View className="h-5 w-3/4 bg-[#2A2B2E] rounded animate-pulse" />
                                <View className="h-4 w-1/4 bg-[#2A2B2E] rounded mt-2 animate-pulse" />
                                <View className="h-4 w-1/3 bg-[#2A2B2E] rounded mt-2 animate-pulse" />
                            </View>
                            <View className="items-end">
                                <View className="h-5 w-20 bg-[#2A2B2E] rounded animate-pulse" />
                                <View className="h-4 w-16 bg-[#2A2B2E] rounded mt-2 animate-pulse" />
                                <View className="h-4 w-16 bg-[#2A2B2E] rounded mt-2 animate-pulse" />
                            </View>
                        </View>
                    ))}
                </View>
            );
        }

        return null;
    };

    if (error) {
        return (
            <View className="flex-1 justify-center items-center px-6">
                <View className="w-full bg-gradient-to-br from-[#1F1F1F] to-[#2A2B2E] rounded-3xl p-8 border border-[#3A3B3E] shadow-lg">
                    <View className="items-center mb-6">
                        <Text className="text-6xl mb-4">📈</Text>
                        <Text className="text-white font-manrope-bold text-20 mb-3">
                            Portfolio Not Connected
                        </Text>
                        <Text className="text-[#B1B1B1] font-manrope text-14 leading-6 text-center mb-6">
                            This trader hasn't connected their portfolio yet.
                            Follow them to get notified when they share their
                            holdings and insights! 🚀
                        </Text>
                    </View>
                    <View className="bg-[#2A2B2E] rounded-2xl p-4 border border-[#3A3B3E]">
                        <View className="flex-row items-center mb-3">
                            <Text className="text-2xl mr-3">💡</Text>
                            <Text className="text-white font-manrope-bold text-14">
                                Why follow them?
                            </Text>
                        </View>
                        <View className="space-y-2">
                            <View className="flex-row items-center">
                                <Text className="text-primary-main mr-2">
                                    •
                                </Text>
                                <Text className="text-[#B1B1B1] font-manrope text-13">
                                    Get notified when they connect portfolio
                                </Text>
                            </View>
                            <View className="flex-row items-center">
                                <Text className="text-primary-main mr-2">
                                    •
                                </Text>
                                <Text className="text-[#B1B1B1] font-manrope text-13">
                                    See their trading insights & strategies
                                </Text>
                            </View>
                            <View className="flex-row items-center">
                                <Text className="text-primary-main mr-2">
                                    •
                                </Text>
                                <Text className="text-[#B1B1B1] font-manrope text-13">
                                    Learn from their investment decisions
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    if (!data?.securities?.length && !isLoading) {
        return (
            <View className="flex-1 justify-center items-center px-6">
                <View className="w-full bg-[#1F1F1F] rounded-2xl p-5 border border-[#2A2B2E]">
                    <Text className="text-white font-manrope-bold text-16 mb-2">
                        No holdings yet
                    </Text>
                    <Text className="text-[#B1B1B1] font-manrope text-13 leading-5">
                        This trader hasn’t added any holdings to their
                        portfolio. Check back later for updates.
                    </Text>
                </View>
            </View>
        );
    }

    const renderStockItem = ({ item }) => (
        <StockItem item={item} viewMode={viewMode} />
    );

    return (
        <>
            <FlatList
                data={isLoading ? [] : data.securities}
                keyExtractor={(item) => item.isin}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderListContent()}
                renderItem={renderStockItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
            <PortfolioCopilotModal
                visible={isCopilotOpen}
                onClose={() => setIsCopilotOpen(false)}
                userId={userId}
            />
        </>
    );
};

export default UserProfilePortfolio;
