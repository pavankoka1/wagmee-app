import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import clsx from "clsx";
import SmallStockDetailsBottomSheet from "./SmallStockDetailsBottomSheet";
import StockDetailsBottomSheet from "@/components/search/StockDetailsBottomSheet";

export const StockItem = ({ item, displayMode, toggleDisplayMode }) => {
    const [isSmallSheetOpen, setIsSmallSheetOpen] = useState(false);
    const [isFullModalOpen, setIsFullModalOpen] = useState(false);

    // Calculate profit/loss and percentage change
    const profitLoss =
        item.currentPrice && item.holdings.averagePrice
            ? (Number(item.currentPrice) - Number(item.holdings.averagePrice)) *
              Number(item.holdings.quantity)
            : 0;
    const percentageChange =
        item.currentPrice && item.holdings.averagePrice
            ? ((Number(item.currentPrice) -
                  Number(item.holdings.averagePrice)) /
                  Number(item.holdings.averagePrice)) *
              100
            : 0;
    const currentValue =
        item.currentPrice && item.holdings.quantity
            ? Number(item.currentPrice) * Number(item.holdings.quantity)
            : 0;
    const investedAmount =
        item.holdings.averagePrice && item.holdings.quantity
            ? Number(item.holdings.averagePrice) *
              Number(item.holdings.quantity)
            : 0;

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

                {/* Right Section: Current Value/Invested or Profit/Loss/Percentage */}
                <TouchableOpacity
                    onPress={toggleDisplayMode}
                    className="items-end"
                >
                    {displayMode === "current" ? (
                        <>
                            <Text
                                className={clsx(
                                    "text-base font-semibold",
                                    profitLoss >= 0
                                        ? "text-[#22c55e]"
                                        : "text-[#ef4444]"
                                )}
                            >
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
                            <Text
                                className={clsx(
                                    "text-base font-semibold",
                                    profitLoss >= 0
                                        ? "text-[#22c55e]"
                                        : "text-[#ef4444]"
                                )}
                            >
                                {profitLoss >= 0 ? "+" : "-"}₹
                                {Math.abs(profitLoss).toLocaleString("en-IN", {
                                    maximumFractionDigits: 2,
                                })}
                            </Text>
                            <Text
                                className={clsx(
                                    "text-xs tracking-wide mt-1",
                                    percentageChange >= 0
                                        ? "text-[#22c55e]"
                                        : "text-[#ef4444]"
                                )}
                            >
                                {percentageChange >= 0 ? "+" : "-"}
                                {Math.abs(percentageChange).toFixed(2)}%
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
                    )}
                </TouchableOpacity>
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
            />
        </View>
    );
};

export default StockItem;
