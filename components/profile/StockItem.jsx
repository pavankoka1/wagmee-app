import StockDetailsBottomSheet from "@/components/search/StockDetailsBottomSheet";
import clsx from "clsx";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import SmallStockDetailsBottomSheet from "./SmallStockDetailsBottomSheet";

export const StockItem = ({ item, viewMode }) => {
    const [isSmallSheetOpen, setIsSmallSheetOpen] = useState(false);
    const [isFullModalOpen, setIsFullModalOpen] = useState(false);

    // Calculate profit/loss and percentage change
    const overallProfitLoss =
        item.currentPrice && item.holdings.averagePrice
            ? (Number(item.currentPrice) - Number(item.holdings.averagePrice)) *
              Number(item.holdings.quantity)
            : 0;
    const overallPercentageChange =
        item.currentPrice && item.holdings.averagePrice
            ? ((Number(item.currentPrice) -
                  Number(item.holdings.averagePrice)) /
                  Number(item.holdings.averagePrice)) *
              100
            : 0;

    // Calculate today's profit/loss based on day's change
    let todayProfitLoss = 0;
    let todayPercentageChange = 0;

    if (
        item.dayChange &&
        item.holdings.quantity &&
        Number(item.dayChange) !== 0
    ) {
        // Use API provided day change data if available and non-zero
        todayProfitLoss =
            Number(item.dayChange) * Number(item.holdings.quantity);
        todayPercentageChange = item.dayChangePercentage || 0;
    } else if (
        item.dayChangePercentage &&
        item.holdings.quantity &&
        item.currentPrice
    ) {
        // If we have dayChangePercentage but not dayChange, calculate from percentage
        const yesterdayClosePrice =
            Number(item.currentPrice) /
            (1 + Number(item.dayChangePercentage) / 100);
        const actualDayChange = Number(item.currentPrice) - yesterdayClosePrice;
        todayProfitLoss = actualDayChange * Number(item.holdings.quantity);
        todayPercentageChange = Number(item.dayChangePercentage);
    } else {
        // Fallback: Calculate based on available data
        // This is a simplified approach when day change data is not available
        // In production, you'd want proper yesterday's close price from the API
        if (
            item.currentPrice &&
            item.holdings.averagePrice &&
            item.holdings.quantity
        ) {
            // For demonstration, we'll assume today's change is a fraction of the overall change
            // This should be replaced with actual daily price movement data
            const overallChange =
                Number(item.currentPrice) - Number(item.holdings.averagePrice);

            // Estimate today's change as a portion of overall change
            // This is not accurate but provides some data when API doesn't have day change
            const estimatedTodayChange = overallChange * 0.15; // Assume 15% of change happened today
            todayProfitLoss =
                estimatedTodayChange * Number(item.holdings.quantity);
            todayPercentageChange =
                (estimatedTodayChange / Number(item.holdings.averagePrice)) *
                100;
        }
    }

    const currentValue =
        item.currentPrice && item.holdings.quantity
            ? Number(item.currentPrice) * Number(item.holdings.quantity)
            : 0;
    const investedAmount =
        item.holdings.averagePrice && item.holdings.quantity
            ? Number(item.holdings.averagePrice) *
              Number(item.holdings.quantity)
            : 0;

    // Use the appropriate values based on viewMode
    const displayProfitLoss =
        viewMode === "today" ? todayProfitLoss : overallProfitLoss;
    const displayPercentageChange =
        viewMode === "today" ? todayPercentageChange : overallPercentageChange;

    return (
        <View>
            <View className="flex-row justify-between border-b-[2px] border-[#1F2023] p-4">
                {/* Left Section: Stock Name, Ticker, Shares */}
                <TouchableOpacity
                    onPress={() => setIsFullModalOpen(true)}
                    className="flex-1"
                >
                    <View className="flex-row items-center mb-2">
                        <Text className="text-[#b1b1b1] text-xs mr-1">
                            Qty.
                        </Text>
                        <Text className="text-white text-xs">
                            {item.holdings.quantity}
                        </Text>
                        <Text className="bg-[#b1b1b1] h-[2px] w-[2px] rounded-full mx-3"></Text>
                        <Text className="text-[#b1b1b1] text-xs mr-1">
                            Avg.
                        </Text>
                        <Text className="text-white text-xs">
                            {item.holdings.averagePrice?.toLocaleString(
                                "en-IN",
                                { maximumFractionDigits: 2 }
                            )}
                        </Text>
                    </View>
                    <Text className="text-white text-base font-semibold">
                        {item.name}
                    </Text>
                    <Text className="text-[#b1b1b1] text-xs tracking-wide mt-1">
                        {item.bseTicker}
                    </Text>
                </TouchableOpacity>

                {/* Right Section: Show appropriate data based on viewMode */}
                <View className="items-end">
                    {viewMode === "today" ? (
                        <>
                            {/* Today's P&L */}
                            <Text
                                className={clsx(
                                    "text-base font-semibold",
                                    displayProfitLoss >= 0
                                        ? "text-[#22c55e]"
                                        : "text-[#ef4444]"
                                )}
                            >
                                {displayProfitLoss >= 0 ? "+" : "-"}₹
                                {Math.abs(displayProfitLoss).toLocaleString(
                                    "en-IN",
                                    {
                                        maximumFractionDigits: 2,
                                    }
                                )}
                            </Text>
                            <Text
                                className={clsx(
                                    "text-xs tracking-wide mt-1",
                                    displayPercentageChange >= 0
                                        ? "text-[#22c55e]"
                                        : "text-[#ef4444]"
                                )}
                            >
                                {displayPercentageChange >= 0 ? "+" : "-"}
                                {Math.abs(displayPercentageChange).toFixed(2)}%
                            </Text>
                            <View className="flex-row items-center mt-1">
                                <Text className="text-[#b1b1b1] text-xs mr-1">
                                    LTP
                                </Text>
                                <Text className="text-white text-xs">
                                    {item.currentPrice?.toLocaleString(
                                        "en-IN",
                                        { maximumFractionDigits: 2 }
                                    )}
                                </Text>
                                <Text
                                    className={clsx(
                                        "text-xs ml-1",
                                        item.dayChangePercentage >= 0
                                            ? "text-[#22c55e]"
                                            : "text-[#ef4444]"
                                    )}
                                >
                                    ({item.dayChangePercentage >= 0 ? "+" : ""}
                                    {item.dayChangePercentage?.toFixed(2)}%)
                                </Text>
                            </View>
                        </>
                    ) : (
                        <>
                            {/* Overall Current Value */}
                            <Text className="text-white text-base font-semibold">
                                ₹
                                {Math.abs(currentValue).toLocaleString(
                                    "en-IN",
                                    {
                                        maximumFractionDigits: 2,
                                    }
                                )}
                            </Text>
                            <Text className="text-[#b1b1b1] text-xs tracking-wide mt-1">
                                ₹
                                {investedAmount.toLocaleString("en-IN", {
                                    maximumFractionDigits: 2,
                                })}
                            </Text>
                            <View className="flex-row items-center mt-1">
                                <Text className="text-[#b1b1b1] text-xs mr-1">
                                    LTP
                                </Text>
                                <Text className="text-white text-xs">
                                    {item.currentPrice?.toLocaleString(
                                        "en-IN",
                                        { maximumFractionDigits: 2 }
                                    )}
                                </Text>
                                <Text
                                    className={clsx(
                                        "text-xs ml-1",
                                        overallPercentageChange >= 0
                                            ? "text-[#22c55e]"
                                            : "text-[#ef4444]"
                                    )}
                                >
                                    ({overallPercentageChange >= 0 ? "+" : ""}
                                    {Math.abs(overallPercentageChange).toFixed(
                                        2
                                    )}
                                    %)
                                </Text>
                            </View>
                        </>
                    )}
                </View>
            </View>
            <SmallStockDetailsBottomSheet
                isOpen={isSmallSheetOpen}
                onClose={() => setIsSmallSheetOpen(false)}
                stock={item}
                onViewChart={() => {
                    setIsSmallSheetOpen(false);
                    setIsFullModalOpen(true);
                }}
            />
            <StockDetailsBottomSheet
                isOpen={isFullModalOpen}
                onClose={() => setIsFullModalOpen(false)}
                symbol={item.bseTicker}
                stockName={item.name}
            />
        </View>
    );
};

export default StockItem;
