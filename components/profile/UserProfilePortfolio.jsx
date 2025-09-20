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
import StockItem from "./StockItem";

const { width } = Dimensions.get("window");

const UserProfilePortfolio = ({ userId }) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState("overall"); // "today" or "overall"
    const togglePosition = useSharedValue(0); // 0 for "overall", 1 for "today"

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
        <View className="absolute top-4 right-4 z-10">
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
        </View>
    );

    const renderHeader = () => {
        if (isLoading) {
            return (
                <View className="relative">
                    {renderToggleButton()}
                    <View className="bg-[#1F2023] p-4 mx-4 mt-16 rounded-lg shadow-md">
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
            <View className="relative">
                {renderToggleButton()}
                <View className="bg-[#1F2023] p-4 mx-4 mt-16 rounded-lg shadow-md">
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
            <View className="flex-1 justify-center items-center">
                <Text className="text-[#B1B1B1] font-manrope-bold text-16 mb-1">
                    Portfolio not connected
                </Text>
                <Text className="text-white font-manrope text-14">
                    This user hasn't connected their portfolio yet.
                </Text>
            </View>
        );
    }

    if (!data?.securities?.length && !isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-[#B1B1B1] font-manrope-bold text-16 mb-1">
                    No holdings yet!
                </Text>
                <Text className="text-white font-manrope text-14">
                    This user hasn't added any holdings to their portfolio.
                </Text>
            </View>
        );
    }

    const renderStockItem = ({ item }) => (
        <StockItem item={item} viewMode={viewMode} />
    );

    return (
        <FlatList
            data={isLoading ? [] : data.securities}
            keyExtractor={(item) => item.isin}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderListContent()}
            renderItem={renderStockItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
        />
    );
};

export default UserProfilePortfolio;
