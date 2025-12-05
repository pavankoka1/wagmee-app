import VerifiedIcon from "@/icons/VerifiedIcon";
import network from "@/network";
import API_PATHS from "@/network/apis";
import replacePlaceholders from "@/utils/replacePlaceholders";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { HEADERS_KEYS } from "@/network/constants";

const TABS = [
    { key: "today", label: "Today" },
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
    { key: "all-time", label: "All Time" },
];

const LeaderboardRow = ({ entry, isCurrentUser }) => {
    const positive = entry.returnPercentage >= 0;
    return (
        <View
            className={clsx(
                "flex-row items-center px-4 py-3 border-b border-[#1F2023]",
                isCurrentUser && "bg-[#1F1F1F]"
            )}
        >
            <Text className="w-8 font-manrope-bold text-12 text-[#B1B1B1]">
                {entry.rank}
            </Text>
            <View className="flex-1 flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-[#2A2A2A] mr-2 items-center justify-center">
                    <Text className="font-manrope-bold text-12 text-white">
                        {entry.userName?.charAt(0)?.toUpperCase() || "U"}
                    </Text>
                </View>
                <View className="flex-row items-center">
                    <Text className="font-manrope-bold text-12 text-white mr-1">
                        {entry.userName}
                    </Text>
                    {entry.isVerifiedUser && <VerifiedIcon />}
                </View>
            </View>
            <View className="w-24 items-end mr-3">
                <Text className="font-manrope-bold text-12 text-white">
                    ₹
                    {entry.portfolioValue?.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                    })}
                </Text>
            </View>
            <View className="w-20 items-end">
                <Text
                    className={clsx(
                        "font-manrope-bold text-12",
                        positive ? "text-[#22c55e]" : "text-[#ef4444]"
                    )}
                >
                    {positive ? "+" : ""}
                    {((entry.returnPercentage ?? 0) * 100).toFixed(2)}%
                </Text>
                <Text
                    className={clsx(
                        "font-manrope-medium text-10",
                        positive ? "text-[#22c55e]" : "text-[#ef4444]"
                    )}
                >
                    {positive ? "+" : "-"}₹
                    {Math.abs(entry.returnValue ?? 0).toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                    })}
                </Text>
            </View>
        </View>
    );
};

const LeaderboardModal = ({ visible, onClose }) => {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState("today");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const loadUserId = async () => {
            const id = await SecureStore.getItemAsync(HEADERS_KEYS.USER_ID);
            setUserId(id);
        };
        loadUserId();
    }, []);

    useEffect(() => {
        if (!visible) return;

        const fetchLeaderboard = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await network.get(
                    replacePlaceholders(API_PATHS.getLeaderboard, activeTab),
                    { limit: 50 }
                );
                setData(res);
            } catch (e) {
                console.error("Failed to fetch leaderboard:", e);
                setError("Unable to load leaderboard right now.");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [visible, activeTab]);

    const title = useMemo(() => {
        if (data?.title) return data.title;
        switch (activeTab) {
            case "today":
                return "Today's Top Gainers";
            case "week":
                return "This Week's Stars";
            case "month":
                return "Monthly Champions";
            case "all-time":
                return "All-Time Legends";
            default:
                return "Leaderboard";
        }
    }, [data, activeTab]);

    const entries = data?.entries ?? [];

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
            transparent
        >
            <View className="flex-1 bg-black/70">
                <SafeAreaView
                    className="flex-1 bg-[#161616]"
                    style={{ paddingTop: insets.top + 8 }}
                >
                    {/* Header */}
                    <View className="px-4 pb-3 flex-row items-center justify-between">
                        <Text className="font-manrope-bold text-18 text-white">
                            Leaderboard
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            className="px-3 py-1 rounded-full bg-[#1F1F1F]"
                        >
                            <Text className="font-manrope-medium text-12 text-[#B1B1B1]">
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tabs */}
                    <View className="flex-row px-4 pb-2">
                        {TABS.map((tab) => (
                            <TouchableOpacity
                                key={tab.key}
                                onPress={() => setActiveTab(tab.key)}
                                className={clsx(
                                    "px-3 py-2 rounded-full mr-2",
                                    activeTab === tab.key
                                        ? "bg-[#b4ef02]"
                                        : "bg-[#1F1F1F]"
                                )}
                            >
                                <Text
                                    className={clsx(
                                        "font-manrope-bold text-12",
                                        activeTab === tab.key
                                            ? "text-[#161616]"
                                            : "text-white"
                                    )}
                                >
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Title & description */}
                    <View className="px-4 pb-3">
                        <Text className="font-manrope-bold text-16 text-white mb-1">
                            {title}
                        </Text>
                        {data?.description && (
                            <Text className="font-manrope text-12 text-[#B1B1B1]">
                                {data.description}
                            </Text>
                        )}
                    </View>

                    {/* Table header */}
                    <View className="flex-row items-center px-4 py-2 border-y border-[#1F2023] bg-[#101010]">
                        <Text className="w-8 font-manrope-medium text-10 text-[#B1B1B1]">
                            #
                        </Text>
                        <Text className="flex-1 font-manrope-medium text-10 text-[#B1B1B1]">
                            User
                        </Text>
                        <Text className="w-24 text-right font-manrope-medium text-10 text-[#B1B1B1]">
                            Portfolio
                        </Text>
                        <Text className="w-20 text-right font-manrope-medium text-10 text-[#B1B1B1]">
                            Return
                        </Text>
                    </View>

                    {/* Content */}
                    <View className="flex-1">
                        {loading ? (
                            <View className="flex-1 items-center justify-center">
                                <ActivityIndicator size={32} color="#ffffff" />
                            </View>
                        ) : error ? (
                            <View className="flex-1 items-center justify-center px-6">
                                <Text className="font-manrope text-14 text-[#F87171] text-center">
                                    {error}
                                </Text>
                            </View>
                        ) : (
                            <ScrollView>
                                {entries.map((entry) => (
                                    <LeaderboardRow
                                        key={entry.userId}
                                        entry={entry}
                                        isCurrentUser={
                                            userId &&
                                            String(entry.userId) ===
                                                String(userId)
                                        }
                                    />
                                ))}
                                {entries.length === 0 && (
                                    <View className="py-12 items-center justify-center">
                                        <Text className="font-manrope text-14 text-[#B1B1B1]">
                                            No leaderboard data available yet.
                                        </Text>
                                    </View>
                                )}
                            </ScrollView>
                        )}
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
};

export default LeaderboardModal;


