import React from "react";
import { Text, View } from "react-native";

const LoginHeader = () => {
    return (
        <View className="flex-1 justify-center gap-4 w-full">
            <Text
                className="font-manrope-bold text-32 text-white leading-10"
                adjustsFontSizeToFit
                minimumFontScale={0.85}
            >
                See what's {"\n"}Happening in the{"\n"}Market Right now.
            </Text>
            <View className="flex flex-row items-center gap-2">
                <Text className="font-manrope text-white leading-[22px]">
                    Copy
                </Text>
                <View className="text-white h-[3px] w-[3px] bg-primary-main rounded-full" />
                <Text className="font-manrope text-white leading-[22px]">
                    Share
                </Text>
                <View className="text-white h-[3px] w-[3px] bg-primary-main rounded-full" />
                <Text className="font-manrope text-white leading-[22px]">
                    Invest
                </Text>
            </View>
        </View>
    );
};

export default LoginHeader;

