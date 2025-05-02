import { View, Text } from "react-native";
import clsx from "clsx";

export const StockItem = ({ item }) => {
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

    return (
        <View className="flex-row justify-between border-b-[2px] border-[#1F2023] p-4">
            {/* Left Section: Stock Name, Ticker, Shares */}
            <View className="flex-1">
                <Text className="text-white text-base font-semibold">
                    {item.name}
                </Text>
                <Text className="text-[#b1b1b1] text-xs tracking-wide mt-1">
                    {item.bseTicker}
                </Text>
                <Text className="text-[#b1b1b1] text-xs tracking-wide mt-2">
                    {item.holdings.quantity}{" "}
                    {item.holdings.quantity === 1 ? "share" : "shares"}
                </Text>
            </View>

            {/* Right Section: Current Price, Profit/Loss, Percentage */}
            <View className="items-end">
                <Text className="text-white text-base font-semibold">
                    ₹
                    {Number(item.currentPrice).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                    })}
                </Text>
                <Text
                    className={clsx(
                        "text-xs tracking-wide mt-1",
                        profitLoss >= 0 ? "text-primary-main" : "text-red-400"
                    )}
                >
                    {profitLoss >= 0 ? "+" : ""}₹
                    {Math.abs(profitLoss).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                    })}
                </Text>
                <Text
                    className={clsx(
                        "text-xs tracking-wide mt-1",
                        percentageChange >= 0
                            ? "text-primary-main"
                            : "text-red-400"
                    )}
                >
                    {percentageChange >= 0 ? "+" : ""}
                    {percentageChange.toFixed(2)}%
                </Text>
            </View>
        </View>
    );
};

export default StockItem;
