import VerifiedIcon from "@/icons/VerifiedIcon";
import ArrowIcon from "@/icons/ArrowIcon";
import network from "@/network";
import API_PATHS from "@/network/apis";
import replacePlaceholders from "@/utils/replacePlaceholders";
import clsx from "clsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Image,
    Dimensions,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { HEADERS_KEYS } from "@/network/constants";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Button } from "react-native-paper";
import UserListSkeleton from "@/components/search/UserListSkeleton";
import useUserStore from "@/hooks/useUserStore";

const { width } = Dimensions.get("window");

const TABS = [
    { key: "today", label: "Today" },
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
    { key: "all-time", label: "All Time" },
];

// Shimmer component for leaderboard loading
const LeaderboardSkeleton = () => {
    return (
        <View className="px-4">
            {/* Top 1 skeleton - matches TopWinnerCard structure */}
            <View 
                className="bg-[#1F1F1F] rounded-2xl p-6 mb-6 items-center border border-[#2A2A2A]"
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                }}
            >
                {/* Trophy skeleton */}
                <View className="mb-4">
                    <View className="bg-[#b4ef02]/20 rounded-full p-4">
                        <View className="w-10 h-10 bg-[#2A2B2E] rounded-full animate-pulse" />
                    </View>
                </View>
                {/* Rank badge skeleton */}
                <View className="absolute top-4 right-4 bg-[#2A2B2E] rounded-full px-3 py-1 w-8 h-6 animate-pulse" />
                {/* Avatar skeleton */}
                <View className="w-20 h-20 rounded-full bg-[#2A2B2E] mb-3 border-2 border-[#2A2B2E] animate-pulse" />
                {/* Name skeleton */}
                <View className="h-6 w-32 bg-[#2A2B2E] rounded mb-2 animate-pulse" />
                {/* Stats skeleton */}
                <View className="w-full mt-4">
                    <View className="flex-row justify-between items-center mb-3 px-4">
                        <View className="items-center">
                            <View className="h-3 w-16 bg-[#2A2B2E] rounded mb-1 animate-pulse" />
                            <View className="h-5 w-24 bg-[#2A2B2E] rounded animate-pulse" />
                        </View>
                        <View className="w-px h-8 bg-[#2A2A2A]" />
                        <View className="items-center">
                            <View className="h-3 w-16 bg-[#2A2B2E] rounded mb-1 animate-pulse" />
                            <View className="h-5 w-20 bg-[#2A2B2E] rounded animate-pulse" />
                        </View>
                    </View>
                    <View className="bg-[#161616] rounded-xl px-4 py-3">
                        <View className="h-3 w-20 bg-[#2A2B2E] rounded mb-1 mx-auto animate-pulse" />
                        <View className="h-4 w-24 bg-[#2A2B2E] rounded mx-auto animate-pulse" />
                    </View>
                </View>
            </View>
            {/* Table skeleton - matches LeaderboardRow structure */}
            {[...Array(8)].map((_, idx) => (
                <View
                    key={idx}
                    className="flex-row items-center px-4 py-4 border-b border-[#1F2023]"
                >
                    {/* Rank */}
                    <View className="w-10 items-center mr-2">
                        <View className="w-6 h-4 bg-[#2A2B2E] rounded animate-pulse" />
                    </View>
                    {/* Avatar */}
                    <View className="w-12 h-12 rounded-full bg-[#2A2B2E] mr-3 animate-pulse" />
                    {/* Name & Portfolio */}
                    <View className="flex-1">
                        <View className="h-4 w-24 bg-[#2A2B2E] rounded mb-1 animate-pulse" />
                        <View className="h-3 w-20 bg-[#2A2B2E] rounded animate-pulse" />
                    </View>
                    {/* Return */}
                    <View className="items-end">
                        <View className="h-4 w-16 bg-[#2A2B2E] rounded mb-1 animate-pulse" />
                        <View className="h-3 w-14 bg-[#2A2B2E] rounded animate-pulse" />
                    </View>
                </View>
            ))}
        </View>
    );
};

// Top 1 Winner Card
const TopWinnerCard = ({ entry }) => {
    if (!entry) return null;

    const { setProfileBottomSheet } = useUserStore();
    const positive = entry.returnPercentage >= 0;
    const avatarUrl = entry.userAvatarUrl || entry.profilePictureUrl;

    const handleProfilePress = () => {
        if (entry.userId) {
            setProfileBottomSheet(entry.userId);
        }
    };

    return (
        <View className="mx-4 mb-6">
            <View 
                className="bg-[#1F1F1F] rounded-2xl p-6 items-center border border-[#2A2A2A]" 
                style={{ 
                    backgroundColor: "#1F1F1F",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                }}
            >
                {/* Trophy Icon */}
                <View className="mb-4">
                    <View className="bg-[#b4ef02]/20 rounded-full p-3">
                        <Ionicons
                            name="trophy-outline"
                            color="#b4ef02"
                            size={32}
                        />
                    </View>
                </View>

                {/* Rank Badge */}
                <View className="absolute top-4 right-4 bg-[#b4ef02] rounded-full px-3 py-1">
                    <Text className="font-manrope-bold text-12 text-[#161616]">
                        #1
                    </Text>
                </View>

                {/* Avatar */}
                <TouchableOpacity
                    onPress={handleProfilePress}
                    activeOpacity={0.7}
                    className="mb-3"
                >
                    {avatarUrl ? (
                        <Image
                            source={{ uri: avatarUrl }}
                            className="w-20 h-20 rounded-full border-2 border-[#b4ef02]"
                        />
                    ) : (
                        <View className="w-20 h-20 rounded-full bg-[#2A2A2A] border-2 border-[#b4ef02] items-center justify-center">
                            <Text className="font-manrope-bold text-24 text-white">
                                {entry.userName?.charAt(0)?.toUpperCase() || "U"}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Name */}
                <TouchableOpacity
                    onPress={handleProfilePress}
                    activeOpacity={0.7}
                    className="flex-row items-center mb-2"
                >
                    <Text className="font-manrope-bold text-20 text-white mr-2">
                        {entry.userName}
                    </Text>
                    {entry.isVerifiedUser && <VerifiedIcon />}
                </TouchableOpacity>

                {/* Stats */}
                <View className="w-full mt-4">
                    <View className="flex-row justify-between items-center mb-3 px-4">
                        <View className="items-center">
                            <Text className="font-manrope-medium text-11 text-[#B1B1B1] mb-1">
                                Portfolio
                            </Text>
                            <Text className="font-manrope-bold text-16 text-white">
                                ₹
                                {entry.portfolioValue?.toLocaleString("en-IN", {
                                    maximumFractionDigits: 0,
                                })}
                            </Text>
                        </View>
                        <View className="w-px h-8 bg-[#2A2A2A]" />
                        <View className="items-center">
                            <Text className="font-manrope-medium text-11 text-[#B1B1B1] mb-1">
                                Return
                            </Text>
                            <Text
                                className={clsx(
                                    "font-manrope-bold text-16",
                                    positive ? "text-[#22c55e]" : "text-[#ef4444]"
                                )}
                            >
                                {positive ? "+" : ""}
                                {(entry.returnPercentage ?? 0).toFixed(2)}%
                            </Text>
                        </View>
                    </View>
                    <View className="bg-[#161616] rounded-xl px-4 py-3">
                        <Text className="font-manrope-medium text-11 text-[#B1B1B1] text-center mb-1">
                            Gain/Loss
                        </Text>
                        <Text
                            className={clsx(
                                "font-manrope-bold text-14 text-center",
                                positive ? "text-[#22c55e]" : "text-[#ef4444]"
                            )}
                        >
                            {positive ? "+" : "-"}₹
                            {Math.abs(
                                ((entry.portfolioValue ?? 0) *
                                    (entry.returnPercentage ?? 0)) /
                                    100
                            ).toLocaleString("en-IN", {
                                maximumFractionDigits: 0,
                            })}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

// Leaderboard Row
const LeaderboardRow = ({ entry, rank, isCurrentUser }) => {
    const { setProfileBottomSheet } = useUserStore();
    const positive = entry.returnPercentage >= 0;
    const avatarUrl = entry.userAvatarUrl || entry.profilePictureUrl;

    // Medal colors for top 3
    let rankColor = "#B1B1B1";
    if (rank === 2) rankColor = "#C0C0C0"; // Silver
    if (rank === 3) rankColor = "#CD7F32"; // Bronze

    const handleProfilePress = () => {
        if (entry.userId) {
            setProfileBottomSheet(entry.userId);
        }
    };

    return (
        <View
            className={clsx(
                "flex-row items-center px-4 py-4 border-b border-[#1F2023]",
                isCurrentUser && "bg-[#1F1F1F]/50"
            )}
        >
            {/* Rank */}
            <View className="w-10 items-center mr-2">
                {rank <= 3 ? (
                    <Ionicons
                        name={
                            rank === 1
                                ? "medal"
                                : rank === 2
                                ? "medal-outline"
                                : "medal-outline"
                        }
                        color={rank === 1 ? "#b4ef02" : rankColor}
                        size={20}
                    />
                ) : (
                    <Text className="font-manrope-bold text-14 text-[#B1B1B1]">
                        {rank}
                    </Text>
                )}
            </View>

            {/* Avatar */}
            <TouchableOpacity
                onPress={handleProfilePress}
                activeOpacity={0.7}
                className="mr-3"
            >
                {avatarUrl ? (
                    <Image
                        source={{ uri: avatarUrl }}
                        className="w-12 h-12 rounded-full"
                    />
                ) : (
                    <View className="w-12 h-12 rounded-full bg-[#2A2A2A] items-center justify-center">
                        <Text className="font-manrope-bold text-14 text-white">
                            {entry.userName?.charAt(0)?.toUpperCase() || "U"}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* Name & Portfolio */}
            <TouchableOpacity
                onPress={handleProfilePress}
                activeOpacity={0.7}
                className="flex-1"
            >
                <View className="flex-row items-center mb-1">
                    <Text className="font-manrope-bold text-14 text-white mr-2">
                        {entry.userName}
                    </Text>
                    {entry.isVerifiedUser && <VerifiedIcon />}
                </View>
                <Text className="font-manrope-medium text-11 text-[#B1B1B1]">
                    ₹
                    {entry.portfolioValue?.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                    })}
                </Text>
            </TouchableOpacity>

            {/* Return */}
            <View className="items-end">
                <Text
                    className={clsx(
                        "font-manrope-bold text-14 mb-1",
                        positive ? "text-[#22c55e]" : "text-[#ef4444]"
                    )}
                >
                    {positive ? "+" : ""}
                    {(entry.returnPercentage ?? 0).toFixed(2)}%
                </Text>
                <Text
                    className={clsx(
                        "font-manrope-medium text-11",
                        positive ? "text-[#22c55e]" : "text-[#ef4444]"
                    )}
                >
                    {positive ? "+" : "-"}₹
                    {Math.abs(
                        ((entry.portfolioValue ?? 0) *
                            (entry.returnPercentage ?? 0)) /
                            100
                    ).toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                    })}
                </Text>
            </View>
        </View>
    );
};

const LeaderboardPage = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("today");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const currentTabRef = useRef(activeTab);
    const isMountedRef = useRef(true);

    useEffect(() => {
        const loadUserId = async () => {
            const id = await SecureStore.getItemAsync(HEADERS_KEYS.USER_ID);
            setUserId(id);
        };
        loadUserId();
    }, []);

    useEffect(() => {
        currentTabRef.current = activeTab;
    }, [activeTab]);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const tabForThisRequest = activeTab;
            setLoading(true);
            setError(null);
            try {
                const res = await network.get(
                    replacePlaceholders(API_PATHS.getLeaderboard, activeTab),
                    { limit: 50 }
                );
                // Only update state if this is still the current tab and component is mounted
                if (
                    isMountedRef.current &&
                    currentTabRef.current === tabForThisRequest
                ) {
                    setData(res);
                    setLoading(false);
                }
            } catch (e) {
                // Only update state if this is still the current tab and component is mounted
                if (
                    isMountedRef.current &&
                    currentTabRef.current === tabForThisRequest
                ) {
                    console.error("Failed to fetch leaderboard:", e);
                    setError("Unable to load leaderboard right now.");
                    setLoading(false);
                }
            }
        };

        fetchLeaderboard();
    }, [activeTab]);

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
    const topEntry = entries.length > 0 ? entries[0] : null;
    const otherEntries = entries.slice(1);

    return (
        <SafeAreaView className="flex-1 bg-[#161616]">
            {/* Header */}
            <View className="flex flex-row items-center my-3 py-2 px-4 w-screen bg-[#161616]">
                <Button
                    onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace("/(auth)/home");
                        }
                    }}
                    className="m-0 p-0"
                    style={{ minWidth: 0 }}
                >
                    <ArrowIcon />
                </Button>
                <Text className="ml-2 font-manrope-bold text-18 text-white leading-[24px] mr-auto">
                    Leaderboard
                </Text>
            </View>

            {/* Tabs */}
            <View className="flex-row px-4 pb-4 border-b border-[#1F2023]">
                {TABS.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => setActiveTab(tab.key)}
                        className={clsx(
                            "px-4 py-2 rounded-full mr-2",
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
            <View className="px-4 pt-4 pb-2">
                <Text className="font-manrope-bold text-18 text-white mb-1">
                    {title}
                </Text>
                {data?.description && (
                    <Text className="font-manrope text-12 text-[#B1B1B1]">
                        {data.description}
                    </Text>
                )}
            </View>

            {/* Content */}
            {loading ? (
                <ScrollView>
                    <LeaderboardSkeleton />
                </ScrollView>
            ) : error ? (
                <View className="flex-1 items-center justify-center px-6">
                    <Text className="font-manrope text-14 text-[#F87171] text-center">
                        {error}
                    </Text>
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    {/* Top 1 Winner */}
                    {topEntry && <TopWinnerCard entry={topEntry} />}

                    {/* Rest of leaderboard */}
                    {otherEntries.length > 0 && (
                        <View className="mt-2">
                            {otherEntries.map((entry, idx) => (
                                <LeaderboardRow
                                    key={entry.userId}
                                    entry={entry}
                                    rank={idx + 2}
                                    isCurrentUser={
                                        userId &&
                                        String(entry.userId) === String(userId)
                                    }
                                />
                            ))}
                        </View>
                    )}

                    {entries.length === 0 && (
                        <View className="py-12 items-center justify-center">
                            <Ionicons
                                name="trophy-outline"
                                color="#B1B1B1"
                                size={48}
                            />
                            <Text className="font-manrope text-14 text-[#B1B1B1] mt-4">
                                No leaderboard data available yet.
                            </Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default LeaderboardPage;

