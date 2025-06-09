import {
    View,
    Text,
    TouchableNativeFeedback,
    Pressable,
    TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import VerifiedIcon from "@/icons/VerifiedIcon";
import LetterIcon from "./LetterIcon"; // Import the LetterIcon component
import StockDetailsBottomSheet from "./StockDetailsBottomSheet";

const colorCombinations = [
    { backgroundColor: "#1E1E2F", textColor: "#FFFFFF" }, // Dark Blue
    { backgroundColor: "#2C2C3E", textColor: "#FFFFFF" }, // Dark Gray
    { backgroundColor: "#3A3A4D", textColor: "#FFFFFF" }, // Dark Purple
    { backgroundColor: "#4B4B6E", textColor: "#FFFFFF" }, // Dark Teal
    { backgroundColor: "#5C5C7A", textColor: "#FFFFFF" }, // Dark Green
    { backgroundColor: "#6D6D8A", textColor: "#FFFFFF" }, // Dark Red
    { backgroundColor: "#7E7E9D", textColor: "#FFFFFF" }, // Dark Orange
    { backgroundColor: "#8F8FAE", textColor: "#000000" }, // Dark Yellow
    { backgroundColor: "#A0A0C0", textColor: "#000000" }, // Dark Cyan
    { backgroundColor: "#B1B1D2", textColor: "#000000" }, // Dark Magenta
    { backgroundColor: "#D32F2F", textColor: "#FFFFFF" }, // Dark Red
    { backgroundColor: "#1976D2", textColor: "#FFFFFF" }, // Dark Blue
    { backgroundColor: "#7B1FA2", textColor: "#FFFFFF" }, // Dark Purple
    { backgroundColor: "#388E3C", textColor: "#FFFFFF" }, // Dark Green
    { backgroundColor: "#F57C00", textColor: "#FFFFFF" }, // Dark Orange
];

function StockItem({ stock }) {
    const [openStockDetailsSheet, setOpenStockDetailsSheet] = useState(false);

    // Pick a random color combination
    const randomColor =
        colorCombinations[Math.floor(Math.random() * colorCombinations.length)];

    return (
        <View>
            <TouchableOpacity onPress={() => setOpenStockDetailsSheet(true)}>
                <View className="border-b border-[#1F2023] py-2 flex flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                        <Text className="font-manrope-bold text-16 text-white">
                            {stock.instrument_name[0].toUpperCase()}
                        </Text>
                    </View>
                    <View className="flex flex-col ml-3">
                        <View className="flex flex-row gap-1 items-center mb-[2px]">
                            <Text className="font-manrope-bold text-12 text-white">
                                {stock.instrument_name}
                            </Text>
                            <VerifiedIcon />
                        </View>
                        <Text className="text-[#b4ef02] font-manrope-medium text-10">
                            {stock.symbol} - {stock.country}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
            <StockDetailsBottomSheet
                isOpen={openStockDetailsSheet}
                onClose={() => setOpenStockDetailsSheet(false)}
                symbol={stock.symbol}
            />
        </View>
    );
}

export default StockItem;
