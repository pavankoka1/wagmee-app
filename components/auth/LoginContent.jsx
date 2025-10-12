import FacebookIcon from "@/icons/FacebookIcon";
import GoogleIcon from "@/icons/GoogleIcon";
import React from "react";
import { Alert, Linking, Text, TouchableOpacity, View } from "react-native";

const LoginContent = () => {
    const openAuthUrl = () => {
        // Use direct URL with account selection prompt
        const url =
            "https://auth0.wagmee.in/authorize?response_type=code&client_id=sQhMHMtJ2ja30w3nMiKA4yTyN2m8CkbR&redirect_uri=tradetribe://redirect&scope=openid profile email&prompt=select_account&max_age=0";

        Linking.openURL(url).catch((err) => {
            Alert.alert("Error", "Failed to open URL: " + err.message);
        });
    };

    return (
        <>
            <View className="flex-1 justify-center gap-4 w-full">
                <Text className="font-manrope-bold text-32 text-white leading-10">
                    See what’s {"\n"}Happening in the{"\n"}Market Right now.
                </Text>
                <View className="flex flex-row items-center gap-2">
                    <Text className="font-manrope text-white">Copy</Text>
                    <Text className="text-white h-[3px] w-[3px] bg-primary-main rounded-full" />
                    <Text className="font-manrope text-white">Share</Text>
                    <Text className="text-white h-[3px] w-[3px] bg-primary-main rounded-full" />
                    <Text className="font-manrope text-white">Invest</Text>
                </View>
            </View>
            <View className="flex gap-2">
                <TouchableOpacity onPress={openAuthUrl}>
                    <View className="flex flex-row w-full rounded-2xl bg-white items-center px-6 py-4 gap-3">
                        <GoogleIcon />
                        <Text
                            className="font-manrope-bold text-14 text-[#111314] leading-[18px] flex-1"
                            numberOfLines={1}
                        >
                            Continue with Google account
                        </Text>
                    </View>
                </TouchableOpacity>
                <View className="flex flex-row gap-4 items-center">
                    <Text className="h-[1px] flex-1 bg-[#2f2f2f]" />
                    <Text className="font-manrope text-10 text-white">OR</Text>
                    <Text className="h-[1px] flex-1 bg-[#2f2f2f]" />
                </View>
                <TouchableOpacity onPress={openAuthUrl}>
                    <View className="flex flex-row w-full rounded-2xl bg-white items-center px-6 py-4 gap-3">
                        <FacebookIcon />
                        <Text
                            className="font-manrope-bold text-14 text-[#111314] leading-[18px] flex-1"
                            numberOfLines={1}
                        >
                            Continue with Facebook account
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <Text className="font-manrope tracking-wide text-12 text-white mt-6 text-center">
                By Proceeding, I agree TradeTribe’s{" "}
                <Text
                    className="text-primary-main underline"
                    onPress={() => {
                        Linking.openURL("https://wagmee.in/privacy.html");
                    }}
                >
                    T&C, Privacy Policy
                </Text>
            </Text>
        </>
    );
};

export default LoginContent;
