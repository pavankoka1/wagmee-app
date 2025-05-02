import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
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

function StocksList({ onClose }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [holdings, setHoldings] = React.useState([]);

    async function fetchHoldings() {
        setIsLoading(true);
        const gatewayAuthToken = await SecureStore.getItemAsync(
            HEADERS_KEYS.SMALLCASE_AUTH_TOKEN
        );
        const holdingsPath = generateQueryParams(API_PATHS.getHoldings, {
            gatewayAuthToken,
        });

        network
            .get(holdingsPath)
            .then((res) => {
                setHoldings(res.data.securities);
                setIsLoading(false);
            })
            .catch((err) => {
                onClose();
            });
    }

    useEffect(() => {
        fetchHoldings();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-[#161616]">
            <View className="border-b-[2px] border-[#1F2023] py-4 px-4 tracking-wider flex-row items-center justify-between bg-[#161616] z-10">
                <Text className="text-white text-xl">Stocks List</Text>
                <TouchableOpacity onPress={onClose}>
                    <CloseIcon size={10} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={holdings}
                keyExtractor={(item) => item.bseTicker.toString()}
                ListEmptyComponent={
                    isLoading ? (
                        <View className="flex-1 justify-center items-center py-32">
                            <RippleLoader />
                        </View>
                    ) : null
                }
                refreshing={isLoading}
                onRefresh={() => {
                    fetchHoldings();
                }}
                renderItem={({ item }) => <StockItem item={item} />}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

export default StocksList;
