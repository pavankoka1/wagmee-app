import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import network from "@/network";
import API_PATHS from "@/network/apis";
import replacePlaceholders from "@/utils/replacePlaceholders";
import clsx from "clsx";
import StockItem from "./StockItem";

const UserProfilePortfolio = ({ userId }) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayMode, setDisplayMode] = useState("current"); // "current" or "profitLoss"

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

    const toggleDisplayMode = () => {
        setDisplayMode((prev) =>
            prev === "current" ? "profitLoss" : "current"
        );
    };

    const renderHeader = () => {
        if (isLoading) {
            return (
                <View className="bg-[#1F2023] p-4 mx-4 mt-4 rounded-lg shadow-md">
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
                                P&L
                            </Text>
                            <View className="h-5 w-32 bg-[#2A2B2E] rounded animate-pulse" />
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
            <View className="bg-[#1F2023] p-4 mx-4 mt-4 rounded-lg shadow-md">
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
                            P&L
                        </Text>
                        <Text
                            className={clsx(
                                "text-base font-semibold",
                                totalChange >= 0
                                    ? "text-[#22c55e]"
                                    : "text-[#ef4444]"
                            )}
                        >
                            {totalChange >= 0 ? "+" : "-"}₹
                            {Math.abs(totalChange).toLocaleString("en-IN", {
                                maximumFractionDigits: 2,
                            })}{" "}
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
        <StockItem
            item={item}
            displayMode={displayMode}
            toggleDisplayMode={toggleDisplayMode}
        />
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
