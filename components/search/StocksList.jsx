import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import network from "@/network";
import API_PATHS from "@/network/apis";
import generateQueryParams from "@/utils/generateQueryParams";
import VerifiedIcon from "@/icons/VerifiedIcon";
import clsx from "clsx";
import useUserStore from "@/hooks/useUserStore";
import { ActivityIndicator } from "react-native-paper";
import UserItem from "./UserItem";
import useStocks from "@/hooks/useStocks";
import StockItem from "./StockItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function StocksList({ query }) {
    const timerRef = useRef();
    const { stocks, loading, error } = useStocks(query);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size={24} />
            </View>
        );
    }

    if (!stocks.length) {
        return (
            <View className="flex-1 flex-col justify-center items-center px-8">
                {query ? (
                    <>
                        <MaterialCommunityIcons
                            name="chart-line"
                            size={64}
                            color="#B1B1B1"
                        />
                        <Text className="text-[#B1B1B1] font-manrope-bold text-18 mb-2 mt-4 text-center">
                            No Stocks Found
                        </Text>
                        <Text className="text-white font-manrope text-14 text-center">
                            We couldn't find any stocks matching "{query}"
                        </Text>
                        <Text className="text-[#B1B1B1] font-manrope text-12 text-center mt-2">
                            Try searching with a different symbol or company
                            name
                        </Text>
                    </>
                ) : (
                    <>
                        <MaterialCommunityIcons
                            name="chart-timeline-variant"
                            size={64}
                            color="#B1B1B1"
                        />
                        <Text className="text-[#B1B1B1] font-manrope-bold text-18 mb-2 mt-4 text-center">
                            Explore Stocks
                        </Text>
                        <Text className="text-white font-manrope text-14 text-center">
                            Search for stocks by company name or symbol
                        </Text>
                        <Text className="text-[#B1B1B1] font-manrope text-12 text-center mt-2">
                            Try searching for companies like "Apple" or symbols
                            like "AAPL"
                        </Text>
                    </>
                )}
            </View>
        );
    }

    return (
        <View className="flex-1 py-6">
            <FlatList
                data={stocks}
                renderItem={({ item }) => <StockItem stock={item} />}
                keyExtractor={(item) =>
                    "stocks-list-key-" + item.instrument_name + item.symbol
                }
            />
        </View>
    );
}

export default StocksList;
