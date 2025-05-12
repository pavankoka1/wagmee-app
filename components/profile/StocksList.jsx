import { View, Text, FlatList, SafeAreaView } from "react-native";
import React, { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import network from "@/network";
import API_PATHS from "@/network/apis";
import generateQueryParams from "@/utils/generateQueryParams";
import { HEADERS_KEYS } from "@/network/constants";
import RippleLoader from "../Loader";
import clsx from "clsx";
import StockItem from "./StockItem";
import CloseIcon from "@/icons/CloseIcon";
import replacePlaceholders from "@/utils/replacePlaceholders";

function StocksList({ onClose }) {
    const [data, setData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    async function fetchHoldings() {
        setIsLoading(true);
        const gatewayAuthToken = await SecureStore.getItemAsync(
            HEADERS_KEYS.SMALLCASE_AUTH_TOKEN
        );
        const userId = await SecureStore.getItemAsync(HEADERS_KEYS.USER_ID);
        const holdingsPath = generateQueryParams(
            replacePlaceholders(API_PATHS.getHoldings, userId),
            {
                gatewayAuthToken,
            }
        );

        network
            .get(holdingsPath)
            .then((res) => {
                setData(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                onClose();
            });
    }

    useEffect(() => {
        fetchHoldings();
    }, []);

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
                                    ? "text-green-400"
                                    : "text-red-400"
                            )}
                        >
                            {data?.totalChange >= 0 ? "+" : ""}₹
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
                                        ? "text-green-400"
                                        : "text-red-400"
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
                refreshing={isLoading}
                onRefresh={() => {
                    fetchHoldings();
                }}
                renderItem={({ item }) => <StockItem item={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </SafeAreaView>
    );
}

export default StocksList;
