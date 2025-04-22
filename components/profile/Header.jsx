import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import ArrowIcon from "@/icons/ArrowIcon";
import { useRouter } from "expo-router";
import { Button } from "react-native-paper";
import SettingsBottomSheet from "./SettingsBottomSheet";
import SettingsIcon from "@/icons/SettingsIcon";
import useUserStore from "@/hooks/useUserStore";

const Header = () => {
    const router = useRouter();
    const { openSettingsBottomSheet, setSettingsBottomSheet } = useUserStore();

    return (
        <View className="flex flex-row items-center my-3 py-5 pl-2 pr-4">
            <Button
                onPress={() => {
                    router.replace("/(auth)/home");
                }}
            >
                <ArrowIcon />
            </Button>
            <Text className="ml-2 font-manrope-bold text-14 text-white leading-[20px] mr-auto">
                Profile
            </Text>
            <TouchableOpacity onPress={() => setSettingsBottomSheet(true)}>
                <SettingsIcon />
            </TouchableOpacity>
            <SettingsBottomSheet
                isOpen={openSettingsBottomSheet}
                onClose={() => setSettingsBottomSheet(false)}
            />
        </View>
    );
};

export default Header;
