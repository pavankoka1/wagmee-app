import CloseIcon from "@/icons/CloseIcon";
import network from "@/network";
import API_PATHS from "@/network/apis";
import { HEADERS_KEYS } from "@/network/constants";
import replacePlaceholders from "@/utils/replacePlaceholders";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
    Modal,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

const ConfidenceBadge = ({ level }) => {
    if (!level) return null;
    const normalized = String(level).toLowerCase();
    let color = "#38bdf8";
    let bgColor = "#1e3a8a";
    if (normalized === "high") {
        color = "#22c55e";
        bgColor = "#14532d";
    } else if (normalized === "low") {
        color = "#f97316";
        bgColor = "#7c2d12";
    }

    return (
        <View
            className="px-3 py-1 rounded-full flex-row items-center"
            style={{ backgroundColor: bgColor }}
        >
            <Ionicons
                name={
                    normalized === "high"
                        ? "checkmark-circle"
                        : normalized === "low"
                        ? "alert-circle"
                        : "information-circle"
                }
                color={color}
                size={12}
            />
            <Text className="font-manrope-bold text-10 ml-1" style={{ color }}>
                {level.toUpperCase()}
            </Text>
        </View>
    );
};

const PortfolioCopilotModal = ({ visible, onClose, userId: propUserId }) => {
    const insets = useSafeAreaInsets();
    const [userId, setUserId] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUserId = async () => {
            // Use propUserId if provided, otherwise get from SecureStore
            if (propUserId) {
                setUserId(propUserId);
            } else {
                const id = await SecureStore.getItemAsync(HEADERS_KEYS.USER_ID);
                setUserId(id);
            }
        };
        loadUserId();
    }, [propUserId]);

    const fetchSummary = async (opts = { useCached: true }) => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const path = opts.useCached
                ? API_PATHS.getDailyPortfolioSummary
                : API_PATHS.analyzePortfolio;

            const res = await network.get(replacePlaceholders(path, userId));
            setData(res);
        } catch (e) {
            console.error("Failed to fetch portfolio summary:", e);
            setError(
                "We couldn't load your AI summary right now. Please try again in a bit."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (visible && userId) {
            fetchSummary({ useCached: true });
        }
    }, [visible, userId]);

    const handleRefresh = () => {
        if (!userId) return;
        fetchSummary({ useCached: false });
    };

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/80">
                <SafeAreaView
                    className="flex-1 bg-[#161616]"
                    style={{
                        paddingTop: Platform.OS === "ios" ? insets.top : 24,
                    }}
                >
                    {/* Header */}
                    <View
                        className="px-4 py-4 flex-row items-center justify-between border-b border-[#1F2023]"
                        style={{ paddingTop: insets.top + 8 }}
                    >
                        <View className="flex-row items-center flex-1">
                            <View className="bg-[#b4ef02]/20 rounded-full p-2 mr-3">
                                <Ionicons
                                    name="sparkles"
                                    color="#b4ef02"
                                    size={20}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="font-manrope-bold text-18 text-white">
                                    Portfolio Copilot
                                </Text>
                                <View className="flex-row items-center mt-1">
                                    <ConfidenceBadge level={data?.confidence} />
                                </View>
                            </View>
                        </View>
                        <View className="flex-row items-center">
                            <TouchableOpacity
                                onPress={handleRefresh}
                                disabled={loading}
                                className="bg-[#1F1F1F] rounded-full p-2 mr-2"
                            >
                                <Ionicons
                                    name="refresh"
                                    color={loading ? "#666" : "#b4ef02"}
                                    size={20}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onClose}
                                className="bg-[#1F1F1F] rounded-full p-2"
                            >
                                <CloseIcon />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Content */}
                    {loading ? (
                        <View className="flex-1 items-center justify-center">
                            <View className="items-center">
                                <ActivityIndicator size={40} color="#b4ef02" />
                                <Text className="font-manrope-medium text-14 text-[#B1B1B1] mt-4">
                                    Analyzing your portfolio...
                                </Text>
                            </View>
                        </View>
                    ) : error ? (
                        <View className="flex-1 items-center justify-center px-6">
                            <Ionicons
                                name="alert-circle-outline"
                                color="#F87171"
                                size={48}
                            />
                            <Text className="font-manrope text-14 text-[#F87171] text-center mt-4">
                                {error}
                            </Text>
                        </View>
                    ) : (
                        <ScrollView
                            style={{ flex: 1 }}
                            contentContainerStyle={{
                                paddingHorizontal: 16,
                                paddingBottom: 24,
                                paddingTop: 20,
                            }}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* Summary */}
                            {data?.summary && (
                                <View className="bg-[#1F1F1F] rounded-2xl p-5 mb-4 border border-[#2A2A2A]">
                                    <View className="flex-row items-center mb-3">
                                        <Ionicons
                                            name="document-text"
                                            color="#b4ef02"
                                            size={20}
                                        />
                                        <Text className="font-manrope-bold text-16 text-white ml-2">
                                            AI Summary
                                        </Text>
                                    </View>
                                    <Text className="font-manrope text-14 text-[#E5E5E5] leading-6">
                                        {data.summary}
                                    </Text>
                                </View>
                            )}

                            {/* Key Metrics */}
                            {Array.isArray(data?.key_metrics) &&
                                data.key_metrics.length > 0 && (
                                    <View className="mb-4">
                                        <View className="flex-row items-center mb-3">
                                            <Ionicons
                                                name="stats-chart"
                                                color="#b4ef02"
                                                size={20}
                                            />
                                            <Text className="font-manrope-bold text-16 text-white ml-2">
                                                Key Metrics
                                            </Text>
                                        </View>
                                        <View className="flex-row flex-wrap -mx-1.5">
                                            {data.key_metrics.map(
                                                (metric, idx) => (
                                                    <View
                                                        key={`${metric.name}-${idx}`}
                                                        className="w-1/2 px-1.5 mb-3"
                                                        style={{
                                                            minHeight: 80,
                                                        }}
                                                    >
                                                        <View className="bg-[#1F1F1F] rounded-xl p-4 border border-[#2A2A2A]">
                                                            <Text
                                                                className="font-manrope-medium text-11 text-[#B1B1B1] mb-2"
                                                                numberOfLines={
                                                                    1
                                                                }
                                                            >
                                                                {metric.name}
                                                            </Text>
                                                            <Text
                                                                className="font-manrope-bold text-13 text-white leading-5"
                                                                numberOfLines={
                                                                    3
                                                                }
                                                            >
                                                                {metric.value}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                )
                                            )}
                                        </View>
                                    </View>
                                )}

                            {/* Impact Explanation */}
                            {data?.impact_explanation && (
                                <View className="bg-[#1F1F1F] rounded-2xl p-5 mb-4 border border-[#2A2A2A]">
                                    <View className="flex-row items-center mb-3">
                                        <Ionicons
                                            name="trending-up"
                                            color="#b4ef02"
                                            size={20}
                                        />
                                        <Text className="font-manrope-bold text-16 text-white ml-2">
                                            Market Impact
                                        </Text>
                                    </View>
                                    <Text className="font-manrope text-14 text-[#E5E5E5] leading-6">
                                        {data.impact_explanation}
                                    </Text>
                                </View>
                            )}

                            {/* Actions Suggested */}
                            {data?.actions_suggested && (
                                <View className="bg-[#1F1F1F] rounded-2xl p-5 border border-[#2A2A2A]">
                                    <View className="flex-row items-center mb-3">
                                        <Ionicons
                                            name="bulb"
                                            color="#b4ef02"
                                            size={20}
                                        />
                                        <Text className="font-manrope-bold text-16 text-white ml-2">
                                            Suggested Actions
                                        </Text>
                                    </View>
                                    {data.actions_suggested
                                        .split("\n")
                                        .filter(Boolean)
                                        .map((line, idx) => (
                                            <View
                                                key={`${idx}-${line}`}
                                                className="flex-row mb-2.5"
                                            >
                                                <Ionicons
                                                    name="chevron-forward"
                                                    color="#b4ef02"
                                                    size={16}
                                                    style={{ marginTop: 2 }}
                                                />
                                                <Text className="font-manrope text-13 text-[#E5E5E5] flex-1 ml-2 leading-5">
                                                    {line.replace(/^•\s*/, "")}
                                                </Text>
                                            </View>
                                        ))}
                                </View>
                            )}
                        </ScrollView>
                    )}
                </SafeAreaView>
            </View>
        </Modal>
    );
};

export default PortfolioCopilotModal;
