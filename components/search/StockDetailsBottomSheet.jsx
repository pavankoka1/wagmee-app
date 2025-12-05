import BottomSheet from "@/components/BottomSheet";
import StockOwnersBottomSheet from "@/components/stocks/StockOwnersBottomSheet";
import CloseIcon from "@/icons/CloseIcon";
import network from "@/network";
import API_PATHS from "@/network/apis";
import calculateStockProfits from "@/utils/calculateStockProfits";
import fetchCurrentStockPrice from "@/utils/fetchCurrentStockPrice";
import fetchStockChartData from "@/utils/fetchStockChartData";
import getChartHTML from "@/utils/getChartHTML";
import replacePlaceholders from "@/utils/replacePlaceholders";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const TIMEFRAMES = [
    { label: "1D", days: 1, key: "1D" },
    { label: "3M", days: 90, key: "3M" },
    { label: "6M", days: 180, key: "6M" },
    { label: "1Y", days: 365, key: "1Y" },
    { label: "3Y", days: 365 * 3, key: "3Y" },
    { label: "5Y", days: 365 * 5, key: "5Y" },
    { label: "ALL", days: null, key: "ALL" },
];

const StockDetailsBottomSheet = ({ isOpen, onClose, symbol, stockName }) => {
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);
    const [allChartData, setAllChartData] = useState([]); // Store 1 year of data
    const [chartHTML, setChartHTML] = useState("");
    const [currentPrice, setCurrentPrice] = useState(null);
    const [profits, setProfits] = useState({
        "1D": { profit: 0, percentage: 0 },
        "3M": { profit: 0, percentage: 0 },
        "6M": { profit: 0, percentage: 0 },
        "1Y": { profit: 0, percentage: 0 },
    });
    const [selectedTimeframe, setSelectedTimeframe] = useState("1Y");
    const webViewRef = useRef(null);
    const insets = useSafeAreaInsets();

    const [owners, setOwners] = useState([]);
    const [ownerCount, setOwnerCount] = useState(null);
    const [ownersLoading, setOwnersLoading] = useState(false);
    const [ownersError, setOwnersError] = useState(null);
    const [isOwnersSheetOpen, setIsOwnersSheetOpen] = useState(false);

    // Update chart data when timeframe changes
    const updateChartData = React.useCallback(
        (data, timeframe) => {
            if (!data || data.length === 0) return;

            const timeframeConfig = TIMEFRAMES.find((t) => t.key === timeframe);
            if (!timeframeConfig) return;

            let filteredData;

            if (timeframe === "1D") {
                filteredData = data.slice(-Math.min(10, data.length));
            } else if (timeframeConfig.days) {
                const now = new Date();
                const cutoffDate = new Date(
                    now.getTime() - timeframeConfig.days * 24 * 60 * 60 * 1000
                );

                filteredData = data.filter((item) => {
                    const itemDate = new Date(item.time);
                    return itemDate >= cutoffDate;
                });
            } else {
                filteredData = data;
            }

            if (!filteredData || filteredData.length === 0) {
                filteredData = data;
            }

            setChartData(filteredData);

            const html = getChartHTML(symbol, filteredData);
            setChartHTML(html);

            setTimeout(() => {
                if (webViewRef.current) {
                    webViewRef.current.postMessage(
                        JSON.stringify({
                            type: "updateData",
                            data: filteredData,
                        })
                    );
                }
            }, 100);
        },
        [symbol]
    );

    // Fetch all data when symbol changes (1 year for calculations)
    useEffect(() => {
        if (isOpen && symbol) {
            setLoading(true);
            // Fetch 1 year of data for calculations
            Promise.all([
                fetchStockChartData(symbol, "NSE", 365 * 5),
                fetchCurrentStockPrice(symbol, "NSE"),
            ])
                .then(([data, price]) => {
                    setAllChartData(data);
                    setCurrentPrice(price);

                    // Calculate profits
                    if (data && data.length > 0 && price) {
                        const calculatedProfits = calculateStockProfits(
                            data,
                            price
                        );
                        setProfits(calculatedProfits);
                    }

                    // Set initial chart data based on selected timeframe
                    updateChartData(data, selectedTimeframe);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching stock data:", error);
                    setLoading(false);
                });
        } else if (!isOpen) {
            // Reset state when modal closes to prevent search blocking
            setChartData([]);
            setAllChartData([]);
            setChartHTML("");
            setCurrentPrice(null);
            setLoading(true);
        }
    }, [isOpen, symbol, selectedTimeframe, updateChartData]);

    // Fetch stock owners and count
    useEffect(() => {
        if (!isOpen || !symbol) {
            setOwners([]);
            setOwnerCount(null);
            setOwnersError(null);
            return;
        }

        const fetchOwnership = async () => {
            try {
                setOwnersLoading(true);
                setOwnersError(null);

                const [ownersRes, countRes] = await Promise.all([
                    network.get(
                        replacePlaceholders(API_PATHS.getStockOwners, symbol)
                    ),
                    network.get(
                        replacePlaceholders(
                            API_PATHS.getStockOwnerCount,
                            symbol
                        )
                    ),
                ]);

                const mappedOwners =
                    Array.isArray(ownersRes) && ownersRes.length
                        ? ownersRes.map((item) => ({
                              id: item.userId,
                              userName: item.userName,
                              userAvatarUrl:
                                  item.userAvatarUrl || item.profilePictureUrl,
                              isVerifiedUser: item.isVerifiedUser,
                          }))
                        : [];

                setOwners(mappedOwners);
                setOwnerCount(
                    typeof countRes?.ownerCount === "number"
                        ? countRes.ownerCount
                        : mappedOwners.length
                );
            } catch (error) {
                console.error("Error fetching stock ownership:", error);
                setOwnersError("Unable to load owners");
            } finally {
                setOwnersLoading(false);
            }
        };

        fetchOwnership();
    }, [isOpen, symbol]);

    // Handle timeframe change
    const handleTimeframeChange = (timeframe) => {
        setSelectedTimeframe(timeframe);
        if (allChartData.length > 0) {
            updateChartData(allChartData, timeframe);
        }
    };

    const handleWebViewMessage = (event) => {
        try {
            const message = JSON.parse(event.nativeEvent.data);
            if (message.type === "chartReady") {
                // Chart is ready, update with data if available
                if (chartData.length > 0) {
                    setTimeout(() => {
                        webViewRef.current?.postMessage(
                            JSON.stringify({
                                type: "updateData",
                                data: chartData,
                            })
                        );
                    }, 100);
                } else {
                    // No data yet, chart will wait
                    setLoading(false);
                }
            } else if (message.type === "dataUpdated") {
                // Data has been successfully updated in the chart
                setLoading(false);
            }
        } catch (error) {
            console.error("Error parsing WebView message:", error);
            setLoading(false);
        }
    };

    // Prevent navigation to external URLs (iOS compliance)
    const handleShouldStartLoadWithRequest = (request) => {
        // Only allow local HTML content
        return request.url.startsWith("about:blank") || request.url === "";
    };

    return (
        <BottomSheet
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={onClose}
            paddingNeeded={false}
            className="flex-1 relative bg-[#161616]"
            closeClassName="opacity-0 pointer-events-none"
        >
            <View className="flex-1 relative">
                {/* Header with Stock Name and Custom Close Button */}
                <View
                    className="absolute top-0 left-0 right-0 z-[9999999] bg-[#161616]"
                    style={{ paddingTop: insets.top + 16 }}
                >
                    <View className="flex-row items-center justify-between px-4 pb-3">
                        <View className="flex-1 pr-4">
                            {stockName && (
                                <Text className="font-manrope-bold text-18 text-white mb-1">
                                    {stockName}
                                </Text>
                            )}
                            {symbol && (
                                <Text className="font-manrope-medium text-14 text-[#b4ef02]">
                                    {symbol} • NSE
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            className="bg-white rounded-full p-2.5 items-center justify-center"
                            style={{
                                width: 36,
                                height: 36,
                            }}
                        >
                            <CloseIcon color="#161616" size={14} />
                        </TouchableOpacity>
                    </View>

                    {/* Current Price Display */}
                    {currentPrice && (
                        <View className="px-4 pb-3">
                            <View className="flex-row items-baseline">
                                <Text className="font-manrope-bold text-24 text-white mr-2">
                                    ₹
                                    {currentPrice.toLocaleString("en-IN", {
                                        maximumFractionDigits: 2,
                                    })}
                                </Text>
                                {profits["1D"] && (
                                    <Text
                                        className={clsx(
                                            "font-manrope-medium text-14",
                                            profits["1D"].percentage >= 0
                                                ? "text-[#22c55e]"
                                                : "text-[#ef4444]"
                                        )}
                                    >
                                        {profits["1D"].percentage >= 0
                                            ? "+"
                                            : ""}
                                        {profits["1D"].percentage.toFixed(2)}% (
                                        {profits["1D"].profit >= 0 ? "+" : ""}₹
                                        {Math.abs(
                                            profits["1D"].profit
                                        ).toLocaleString("en-IN", {
                                            maximumFractionDigits: 2,
                                        })}
                                        )
                                    </Text>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Stock Ownership Preview */}
                    <View className="px-4 pb-3">
                        <TouchableOpacity
                            disabled={ownersLoading || owners.length === 0}
                            onPress={() => {
                                if (owners.length > 0) {
                                    setIsOwnersSheetOpen(true);
                                }
                            }}
                            className={clsx(
                                "flex-row items-center justify-between rounded-xl px-3 py-2 w-full",
                                owners.length > 0
                                    ? "bg-[#1F1F1F]"
                                    : "bg-[#1F1F1F]/60"
                            )}
                        >
                            <View
                                className="flex-row items-center flex-1"
                                style={{ flexShrink: 1 }}
                            >
                                <Text
                                    className="font-manrope-medium text-12 text-[#B1B1B1] mr-2"
                                    numberOfLines={1}
                                >
                                    {ownersLoading
                                        ? "Loading owners..."
                                        : ownerCount && ownerCount > 0
                                        ? `${ownerCount} users own this stock`
                                        : "No owners yet on Wagmee"}
                                </Text>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ gap: -8 }}
                                    style={{ maxWidth: 180 }}
                                >
                                    {owners.slice(0, 6).map((owner, index) => (
                                        <View
                                            key={owner.id}
                                            style={{
                                                marginLeft:
                                                    index === 0 ? 0 : -12,
                                            }}
                                        >
                                            {owner.userAvatarUrl ? (
                                                <Image
                                                    source={{
                                                        uri: owner.userAvatarUrl,
                                                    }}
                                                    style={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: 999,
                                                        borderWidth: 1,
                                                        borderColor: "#161616",
                                                        zIndex: 1000 - index,
                                                    }}
                                                />
                                            ) : (
                                                <View
                                                    style={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: 999,
                                                        backgroundColor:
                                                            "#2A2A2A",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        borderWidth: 1,
                                                        borderColor: "#161616",
                                                        zIndex: 1000 - index,
                                                    }}
                                                >
                                                    <Text className="font-manrope-bold text-12 text-white">
                                                        {owner.userName
                                                            ?.charAt(0)
                                                            ?.toUpperCase() ||
                                                            "U"}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                            {owners.length > 0 && (
                                <Text
                                    className="font-manrope-bold text-10 text-[#b4ef02] ml-2"
                                    style={{ flexShrink: 0 }}
                                >
                                    View all
                                </Text>
                            )}
                        </TouchableOpacity>
                        {ownersError && (
                            <Text className="font-manrope text-10 text-[#F87171] mt-1">
                                {ownersError}
                            </Text>
                        )}
                    </View>

                    {/* Profit/Loss Cards */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="px-4 pb-3"
                        contentContainerStyle={{ gap: 12 }}
                    >
                        {["1D", "3M", "6M", "1Y"].map((period) => {
                            const profit = profits[period];
                            const isPositive = profit.percentage >= 0;
                            return (
                                <View
                                    key={period}
                                    className="bg-[#1F1F1F] rounded-lg px-3 py-2 min-w-[80px]"
                                >
                                    <Text className="text-[#B1B1B1] font-manrope-medium text-10 mb-1">
                                        {period}
                                    </Text>
                                    <Text
                                        className={clsx(
                                            "font-manrope-bold text-14",
                                            isPositive
                                                ? "text-[#22c55e]"
                                                : "text-[#ef4444]"
                                        )}
                                    >
                                        {isPositive ? "+" : ""}
                                        {profit.percentage.toFixed(2)}%
                                    </Text>
                                    <Text
                                        className={clsx(
                                            "font-manrope-medium text-10 mt-0.5",
                                            isPositive
                                                ? "text-[#22c55e]"
                                                : "text-[#ef4444]"
                                        )}
                                    >
                                        {isPositive ? "+" : ""}₹
                                        {Math.abs(profit.profit).toLocaleString(
                                            "en-IN",
                                            {
                                                maximumFractionDigits: 2,
                                            }
                                        )}
                                    </Text>
                                </View>
                            );
                        })}
                    </ScrollView>

                    {/* Timeframe Selector */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="px-4 pb-3"
                        contentContainerStyle={{ paddingRight: 16 }}
                    >
                        {TIMEFRAMES.map((timeframe, index) => (
                            <TouchableOpacity
                                key={timeframe.key}
                                onPress={() =>
                                    handleTimeframeChange(timeframe.key)
                                }
                                className={clsx(
                                    "px-4 py-2 rounded-full mr-2",
                                    selectedTimeframe === timeframe.key
                                        ? "bg-[#b4ef02]"
                                        : "bg-[#1F1F1F]",
                                    index === TIMEFRAMES.length - 1 && "mr-0"
                                )}
                            >
                                <Text
                                    className={clsx(
                                        "font-manrope-bold text-12",
                                        selectedTimeframe === timeframe.key
                                            ? "text-[#161616]"
                                            : "text-white"
                                    )}
                                >
                                    {timeframe.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Chart Container */}
                <View
                    className="flex-1"
                    style={{
                        marginTop: insets.top + (currentPrice ? 240 : 180),
                    }}
                >
                    {loading && (
                        <View className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                            <ActivityIndicator size={32} color="#ffffff" />
                        </View>
                    )}
                    {chartHTML ? (
                        <WebView
                            ref={webViewRef}
                            originWhitelist={["*"]}
                            source={{ html: chartHTML }}
                            javaScriptEnabled={true}
                            scalesPageToFit={false}
                            style={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#161616",
                            }}
                            onMessage={handleWebViewMessage}
                            onShouldStartLoadWithRequest={
                                handleShouldStartLoadWithRequest
                            }
                            onLoadEnd={() => {
                                if (chartData.length > 0) {
                                    setTimeout(() => {
                                        setLoading(false);
                                    }, 300);
                                }
                            }}
                            onNavigationStateChange={(navState) => {
                                if (
                                    navState.url &&
                                    !navState.url.startsWith("about:blank")
                                ) {
                                    // Navigation blocked
                                }
                            }}
                        />
                    ) : null}
                </View>
            </View>
            <StockOwnersBottomSheet
                visible={isOwnersSheetOpen}
                onClose={() => setIsOwnersSheetOpen(false)}
                ticker={symbol}
            />
        </BottomSheet>
    );
};

export default StockDetailsBottomSheet;
