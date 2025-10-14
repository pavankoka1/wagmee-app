import UserItem from "@/components/search/UserItem";
import ArrowIcon from "@/icons/ArrowIcon";
import network from "@/network";
import API_PATHS from "@/network/apis";
import generateQueryParams from "@/utils/generateQueryParams";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PickTradersPage({ onContinue }) {
    const router = useRouter();
    const [traders, setTraders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        network
            .get(generateQueryParams(API_PATHS.getUsersByParams, { query: "" }))
            .then((res) => setTraders(res))
            .finally(() => setLoading(false));
    }, []);

    return (
        <SafeAreaView
            className="flex-1 bg-[#161616]"
            edges={["top", "left", "right"]}
        >
            <View className="flex-1 px-8 flex flex-col h-full">
                {/* Back Icon */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mt-4 mb-2 w-10 h-10 justify-center items-center"
                >
                    <ArrowIcon />
                </TouchableOpacity>
                <Text className="text-white font-manrope text-32 mb-2 mt-2">
                    Follow top traders
                </Text>
                <Text className="text-white font-manrope-light text-14 mb-4">
                    Follow others to explore insights, strategies, and stay
                    updated with their latest moves! 🚀
                </Text>
                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size={32} color="#B4EF02" />
                    </View>
                ) : (
                    <FlatList
                        data={traders}
                        keyExtractor={(item) => "onboarding-trader-" + item.id}
                        renderItem={({ item }) => <UserItem item={item} />}
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                )}
                <TouchableOpacity
                    className="w-full rounded-full mb-8 mt-4"
                    style={{ backgroundColor: "#B4EF02" }}
                    onPress={onContinue}
                    activeOpacity={0.8}
                >
                    <Text className="text-black font-manrope-bold text-14 py-4 text-center">
                        Continue
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
