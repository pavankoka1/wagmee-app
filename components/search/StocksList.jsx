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
            <View className="flex-1 flex-col justify-center items-center">
                <Text className="text-[#B1B1B1] font-manrope-bold text-16 mb-1">
                    No Stocks
                </Text>
                <Text className="text-white font-manrope text-14">
                    We couldn’t find any stocks matching your search
                </Text>
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
