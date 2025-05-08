import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import Header from "./Header";
import Card from "./Card";
import TabButton from "@/components/Tabs/TabButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import SmallcaseIntegration from "./SmallCaseIntegration";
import { HEADERS_KEYS } from "../../network/constants";
import * as SecureStore from "expo-secure-store";

const ZeroScreen = ({ handleTabChange, handleConnectPortfolio }) => {
    return (
        <View className="flex-1 bg-[#161616]">
            <View className="flex-1 flex flex-col items-center justify-center px-4">
                <Text className="font-manrope-bold text-16 text-white text-center mb-2">
                    Connect Your Portfolio
                </Text>
                <Text className="font-manrope text-14 text-center text-[#b1b1b1] leading-6">
                    Share your portfolio, inspire others, and help them{"\n"}
                    succeed just like you. It’s easy to start!
                </Text>
                <TouchableOpacity
                    className="bg-primary-main rounded-full my-4 h-12 flex justify-center items-center w-full"
                    onPress={handleConnectPortfolio}
                >
                    <Text className="font-manrope-bold text-14 text-[#292929] leading-[20px]">
                        Link Your Broker Account
                    </Text>
                </TouchableOpacity>
                <Text className="font-manrope-bold text-12 text-primary-main border-b border-dashed border-primary-main">
                    Is it safe to Login with broker account?
                </Text>
                <View className="flex flex-row gap-2 items-center justify-center mt-4">
                    <Ionicons
                        name="shield-checkmark-sharp"
                        size={16}
                        color="#26F037"
                        className="h-4"
                    />
                    <Text className="font-manrope-bold text-12 text-[#26F037] leading-5">
                        100% Safe & Secure
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default ZeroScreen;
