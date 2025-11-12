import BottomSheet from "@/components/BottomSheet";
import CloseIcon from "@/icons/CloseIcon";
import calculateStockProfits from "@/utils/calculateStockProfits";
import fetchCurrentStockPrice from "@/utils/fetchCurrentStockPrice";
import fetchStockChartData from "@/utils/fetchStockChartData";
import getChartHTML from "@/utils/getChartHTML";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const TIMEFRAMES = [
    { label: "1D", days: 1, key: "1D" },
    { label: "3M", days: 90, key: "3M" },
    { label: "6M", days: 180, key: "6M" },
    { label: "1Y", days: 365, key: "1Y" },
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

    // Update chart data when timeframe changes
    const updateChartData = React.useCallback(
        (data, timeframe) => {
            if (!data || data.length === 0) return;

            const timeframeConfig = TIMEFRAMES.find((t) => t.key === timeframe);
            if (!timeframeConfig) return;

            let filteredData;

            if (timeframe === "1D") {
                // For 1D, show last 5-10 data points (recent trading days)
                filteredData = data.slice(-10);
            } else {
                // Filter data for selected timeframe
                const now = new Date();
                const cutoffDate = new Date(
                    now.getTime() - timeframeConfig.days * 24 * 60 * 60 * 1000
                );

                filteredData = data.filter((item) => {
                    const itemDate = new Date(item.time);
                    return itemDate >= cutoffDate;
                });
            }

            setChartData(filteredData);

            // Update chart HTML
            const html = getChartHTML(symbol, filteredData);
            setChartHTML(html);

            // Update WebView chart
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
                fetchStockChartData(symbol, "NSE", 365),
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
                    <View className="flex-row px-4 pb-3 gap-2">
                        {TIMEFRAMES.map((timeframe) => (
                            <TouchableOpacity
                                key={timeframe.key}
                                onPress={() =>
                                    handleTimeframeChange(timeframe.key)
                                }
                                className={clsx(
                                    "px-4 py-2 rounded-full",
                                    selectedTimeframe === timeframe.key
                                        ? "bg-[#b4ef02]"
                                        : "bg-[#1F1F1F]"
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
                    </View>
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
        </BottomSheet>
    );
};

export default StockDetailsBottomSheet;
