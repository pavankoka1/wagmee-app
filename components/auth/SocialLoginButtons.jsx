import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import AppleIcon from "@/icons/AppleIcon";
import FacebookIcon from "@/icons/FacebookIcon";
import GoogleIcon from "@/icons/GoogleIcon";

const SocialLoginButtons = ({ onApplePress, onGooglePress, onFacebookPress, onEmailPress, isLoading }) => {
    const isIOS = Platform.OS === "ios";

    return (
        <View className="flex gap-2">
            {/* Apple Sign In - Required by Apple (Guideline 4.8) - Only on iOS */}
            {isIOS && (
                <>
                    <TouchableOpacity
                        onPress={onApplePress}
                        disabled={isLoading}
                        className={isLoading ? "opacity-70" : undefined}
                    >
                        <View className="flex flex-row w-full rounded-2xl bg-white items-center px-8 py-5 gap-4">
                            <AppleIcon />
                            <Text
                                className="font-manrope-bold text-14 text-[#111314] leading-[20px] flex-1"
                                numberOfLines={1}
                                allowFontScaling={false}
                            >
                                Continue with Apple
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Show "OR" divider if on iOS */}
                    <View className="flex flex-row gap-4 items-center">
                        <View className="h-[1px] flex-1 bg-[#2f2f2f]" />
                        <Text className="font-manrope text-10 text-white">OR</Text>
                        <View className="h-[1px] flex-1 bg-[#2f2f2f]" />
                    </View>
                </>
            )}

            <TouchableOpacity
                onPress={onGooglePress}
                disabled={isLoading}
                className={isLoading ? "opacity-70" : undefined}
            >
                <View className="flex flex-row w-full rounded-2xl bg-white items-center px-8 py-5 gap-4">
                    <GoogleIcon />
                    <Text
                        className="font-manrope-bold text-14 text-[#111314] leading-[20px] flex-1"
                        numberOfLines={1}
                        allowFontScaling={false}
                    >
                        Continue with Google account
                    </Text>
                </View>
            </TouchableOpacity>

            <View className="flex flex-row gap-4 items-center">
                <View className="h-[1px] flex-1 bg-[#2f2f2f]" />
                <Text className="font-manrope text-10 text-white">OR</Text>
                <View className="h-[1px] flex-1 bg-[#2f2f2f]" />
            </View>

            <TouchableOpacity
                onPress={onFacebookPress}
                disabled={isLoading}
                className={isLoading ? "opacity-70" : undefined}
            >
                <View className="flex flex-row w-full rounded-2xl bg-white items-center px-8 py-5 gap-4">
                    <FacebookIcon />
                    <Text
                        className="font-manrope-bold text-14 text-[#111314] leading-[20px] flex-1"
                        numberOfLines={1}
                        allowFontScaling={false}
                    >
                        Continue with Facebook account
                    </Text>
                </View>
            </TouchableOpacity>

            <View className="flex flex-row gap-4 items-center">
                <View className="h-[1px] flex-1 bg-[#2f2f2f]" />
                <Text className="font-manrope text-10 text-white">OR</Text>
                <View className="h-[1px] flex-1 bg-[#2f2f2f]" />
            </View>

            <TouchableOpacity
                onPress={onEmailPress}
                disabled={isLoading}
                className={isLoading ? "opacity-70" : undefined}
            >
                <View className="flex flex-row w-full rounded-2xl bg-[#2f2f2f] items-center justify-center px-8 py-5 gap-4">
                    <Text
                        className="font-manrope-bold text-14 text-white leading-[20px]"
                        numberOfLines={1}
                        allowFontScaling={false}
                    >
                        Continue with Email
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default SocialLoginButtons;

