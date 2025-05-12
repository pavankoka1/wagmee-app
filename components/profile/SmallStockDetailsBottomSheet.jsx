import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    Animated,
    Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { WebView } from "react-native-webview";
import CloseIcon from "@/icons/CloseIcon"; // Adjust import path
import { ActivityIndicator } from "react-native-paper";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const SmallStockDetailsBottomSheet = ({
    isOpen,
    onClose,
    stock,
    onViewChart,
}) => {
    const [loadingGraph, setLoadingGraph] = useState(true);
    const [graphError, setGraphError] = useState(false);
    const [translateY] = useState(new Animated.Value(SCREEN_HEIGHT)); // Start off-screen

    // Log stock props for debugging
    useEffect(() => {
        console.log("SmallStockDetailsBottomSheet props:", {
            isOpen,
            stock: JSON.stringify(stock),
            bseTicker: stock?.bseTicker,
        });
    }, [isOpen, stock]);

    // Animation for sheet
    useEffect(() => {
        if (isOpen) {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(translateY, {
                toValue: SCREEN_HEIGHT,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isOpen]);

    // Calculate profit/loss and percentage change
    const profitLoss =
        stock?.currentPrice && stock?.holdings?.averagePrice
            ? (Number(stock.currentPrice) -
                  Number(stock.holdings.averagePrice)) *
              Number(stock.holdings.quantity)
            : 0;
    const percentageChange =
        stock?.currentPrice && stock?.holdings?.averagePrice
            ? ((Number(stock.currentPrice) -
                  Number(stock.holdings.averagePrice)) /
                  Number(stock.holdings.averagePrice)) *
              100
            : 0;
    const currentPrice = stock?.currentPrice || 0;
    const ticker = stock?.bseTicker || "RELIANCE"; // Fallback ticker

    const tradingViewHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>body, html {margin: 0; padding: 0; height: 100%;}</style>
  </head>
  <body>
    <!-- TradingView widget for today's detailed chart -->
    <div class="tradingview-widget-container" style="height: 100%; width: 100%;">
      <div id="tv_chart"></div>
      <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
      <script type="text/javascript">
        new TradingView.widget({
          "autosize": true,
          "symbol": "NASDAQ:AAPL",
          "interval": "15",
          "timeframes": [
            { "text": "15m", "resolution": "15" },
            { "text": "1h", "resolution": "60" },
            { "text": "D", "resolution": "D", "default": true }
          ],
          "container_id": "tv_chart",
          "toolbar_bg": "#f1f3f6",
          "hide_side_toolbar": false,
          "allow_symbol_change": false,
          "hideideas": true,
          "studies": ["MASimple@tv-basicstudies"],
          "theme": "Light"
        });
      </script>
    </div>
  </body>
  </html>
  `;

    const handleOverlayClick = () => {
        console.log("Overlay clicked, closing sheet");
        onClose();
    };

    return (
        <Modal
            transparent={true}
            visible={isOpen}
            animationType="none"
            onRequestClose={() => {
                console.log("Modal onRequestClose triggered");
                onClose();
            }}
        >
            <TouchableWithoutFeedback onPress={handleOverlayClick}>
                <View className="flex-1 bg-[#161616] bg-opacity-60 justify-end">
                    <Animated.View
                        style={{
                            transform: [{ translateY }],
                            maxHeight: SCREEN_HEIGHT * 0.3, // ~30% of screen
                            backgroundColor: "#161616",
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: -2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                        }}
                    >
                        <View className="p-4 relative">
                            {/* Close Button */}
                            <TouchableOpacity
                                onPress={() => {
                                    console.log("Close button clicked");
                                    onClose();
                                }}
                                className="absolute top-4 right-4 z-10"
                            >
                                <CloseIcon
                                    fill="#b1b1b1"
                                    width={24}
                                    height={24}
                                />
                            </TouchableOpacity>

                            {/* Header: Stock Name */}
                            <View className="mb-2">
                                <Text className="text-white text-base font-semibold">
                                    {stock?.name || "Unknown Stock"}
                                </Text>
                            </View>

                            {/* Graph */}
                            <View className="mb-2" style={{ height: 120 }}>
                                {loadingGraph && !graphError && (
                                    <View className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <ActivityIndicator
                                            size={24}
                                            color="#ffffff"
                                        />
                                    </View>
                                )}
                                {graphError && (
                                    <View className="w-full h-full bg-[#2a2a2a] rounded-lg flex items-center justify-center">
                                        <Text className="text-[#b1b1b1] text-xs">
                                            Unable to load chart. Check network
                                            or try again.
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setLoadingGraph(true);
                                                setGraphError(false); // Retry loading
                                            }}
                                            className="mt-2"
                                        >
                                            <Text className="text-[#22c55e] text-xs">
                                                Retry
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                <WebView
                                    originWhitelist={["*"]}
                                    source={{ html: tradingViewHtml }}
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    mixedContentMode="always" // Allow mixed content (HTTP/HTTPS)
                                    scalesPageToFit={false}
                                    style={{
                                        width: "100%",
                                        height: 120,
                                        opacity:
                                            loadingGraph && !graphError ? 0 : 1,
                                        backgroundColor: "#161616",
                                    }}
                                    onLoadStart={() => {
                                        console.log(
                                            "WebView loading started for ticker:",
                                            ticker
                                        );
                                    }}
                                    onLoadEnd={() => {
                                        console.log(
                                            "WebView onLoadEnd for ticker:",
                                            ticker
                                        );
                                        setTimeout(() => {
                                            if (loadingGraph) {
                                                console.warn(
                                                    "WebView loading timed out for ticker:",
                                                    ticker
                                                );
                                                setLoadingGraph(false);
                                                setGraphError(true);
                                            }
                                        }, 10000); // 10-second timeout
                                        setLoadingGraph(false);
                                    }}
                                    onError={(syntheticEvent) => {
                                        const { nativeEvent } = syntheticEvent;
                                        console.warn(
                                            "WebView error for ticker",
                                            ticker,
                                            ":",
                                            nativeEvent
                                        );
                                        setLoadingGraph(false);
                                        setGraphError(true);
                                    }}
                                    onHttpError={(syntheticEvent) => {
                                        const { nativeEvent } = syntheticEvent;
                                        console.warn(
                                            "WebView HTTP error for ticker",
                                            ticker,
                                            ":",
                                            nativeEvent
                                        );
                                        setLoadingGraph(false);
                                        setGraphError(true);
                                    }}
                                    onMessage={(event) => {
                                        const message = event.nativeEvent.data;
                                        console.log(
                                            "WebView message:",
                                            message
                                        );
                                        if (
                                            message.includes("Widget error") ||
                                            message.includes(
                                                "GraphError:true"
                                            ) ||
                                            message.includes(
                                                "Failed to load TradingView script"
                                            ) ||
                                            message.includes(
                                                "Max retries reached"
                                            )
                                        ) {
                                            setLoadingGraph(false);
                                            setGraphError(true);
                                        } else if (
                                            message.includes(
                                                "Widget initialized"
                                            )
                                        ) {
                                            setLoadingGraph(false);
                                            setGraphError(false);
                                        }
                                    }}
                                />
                            </View>

                            {/* Stock Details */}
                            <View className="mb-2">
                                <Text className="text-[#b1b1b1] text-xs tracking-wide">
                                    {stock?.bseTicker || "N/A"}
                                </Text>
                                <Text className="text-white text-base font-semibold mt-1">
                                    ₹
                                    {currentPrice.toLocaleString("en-IN", {
                                        maximumFractionDigits: 2,
                                    })}
                                </Text>
                                <View className="flex-row mt-1">
                                    <Text
                                        className={clsx(
                                            "text-sm font-semibold",
                                            profitLoss >= 0
                                                ? "text-[#22c55e]"
                                                : "text-[#ef4444]"
                                        )}
                                    >
                                        {profitLoss >= 0 ? "+" : "-"}₹
                                        {Math.abs(profitLoss).toLocaleString(
                                            "en-IN",
                                            {
                                                maximumFractionDigits: 2,
                                            }
                                        )}
                                    </Text>
                                    <Text
                                        className={clsx(
                                            "text-sm ml-2",
                                            percentageChange >= 0
                                                ? "text-[#22c55e]"
                                                : "text-[#ef4444]"
                                        )}
                                    >
                                        ({percentageChange >= 0 ? "+" : "-"}
                                        {Math.abs(percentageChange).toFixed(2)}
                                        %)
                                    </Text>
                                </View>
                            </View>

                            {/* View Chart Button */}
                            <TouchableOpacity
                                onPress={() => {
                                    console.log(
                                        "View Chart clicked for ticker:",
                                        ticker
                                    );
                                    onViewChart();
                                }}
                                className="bg-[#22c55e] rounded-lg py-2 px-4 items-center"
                            >
                                <Text className="text-white text-sm font-semibold">
                                    View Chart
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default SmallStockDetailsBottomSheet;
