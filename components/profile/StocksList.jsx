import {
    View,
    Text,
    FlatList,
    SafeAreaView,
    ToastAndroid,
    RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import network from "@/network";
import API_PATHS from "@/network/apis";
import { HEADERS_KEYS } from "@/network/constants";
import clsx from "clsx";
import StockItem from "./StockItem";
import replacePlaceholders from "@/utils/replacePlaceholders";

function StocksList({ onClose }) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [displayMode, setDisplayMode] = useState("current"); // "current" or "profitLoss"

    async function fetchHoldings() {
        setIsLoading(true);
        try {
            const userId = await SecureStore.getItemAsync(HEADERS_KEYS.USER_ID);
            const holdingsPath = replacePlaceholders(
                API_PATHS.getHoldings,
                userId
            );

            const res = await network.get(holdingsPath);
            setData(res.data);
            setIsLoading(false);
        } catch (err) {
            ToastAndroid.showWithGravityAndOffset(
                "Unable to fetch holdings,\n Please login again!",
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                25,
                50
            );
            onClose();
        }
    }

    useEffect(() => {
        fetchHoldings();
    }, []);

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

        return (
            <View className="bg-[#1F2023] p-4 mx-4 mt-4 rounded-lg shadow-md">
                <View className="flex-row justify-between">
                    <View>
                        <Text className="text-[#b1b1b1] text-xs tracking-wide">
                            Invested
                        </Text>
                        <Text className="text-white text-base font-semibold mt-1">
                            ₹
                            {data?.totalInvestedAmount.toLocaleString("en-IN", {
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
                            {data?.totalCurrentAmount.toLocaleString("en-IN", {
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
                                data?.totalChange >= 0
                                    ? "text-[#22c55e]"
                                    : "text-[#ef4444]"
                            )}
                        >
                            {data.totalChange >= 0 ? "+" : "-"}₹
                            {Math.abs(data?.totalChange).toLocaleString(
                                "en-IN",
                                {
                                    maximumFractionDigits: 2,
                                }
                            )}{" "}
                            <Text
                                className={clsx(
                                    "text-xs",
                                    data?.totalChange >= 0
                                        ? "text-[#22c55e]"
                                        : "text-[#ef4444]"
                                )}
                            >
                                ({data?.totalChangePercentage >= 0 ? "+" : ""}
                                {data?.totalChangePercentage.toFixed(2)}%)
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

    return (
        <SafeAreaView className="flex-1 bg-[#161616]">
            <FlatList
                data={isLoading ? [] : data?.securities}
                keyExtractor={(item) => item.bseTicker.toString()}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderListContent()}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={fetchHoldings}
                        tintColor="#b4ef02"
                        colors={["#b4ef02"]}
                        progressBackgroundColor="transparent"
                    />
                }
                renderItem={({ item }) => (
                    <StockItem
                        item={item}
                        displayMode={displayMode}
                        toggleDisplayMode={toggleDisplayMode}
                    />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </SafeAreaView>
    );
}

export default StocksList;
