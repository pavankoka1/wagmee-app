import { View, Text, TouchableOpacity, Linking } from "react-native";
import React from "react";
import GoogleIcon from "@/icons/GoogleIcon";
import FacebookIcon from "@/icons/FacebookIcon";

const LoginContent = ({ onLoginPress, code, codeVerifier }) => {
    const openAuthUrl = () => {
        const url =
            "https://dev-ejfqnjn20ph3kzag.us.auth0.com/authorize?response_type=code&client_id=sQhMHMtJ2ja30w3nMiKA4yTyN2m8CkbR&redirect_uri=tradetribe://redirect&scope=openid profile email";

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
                    <View className="flex flex-row w-full rounded-2xl bg-white items-center px-8 py-4 gap-4">
                        <GoogleIcon />
                        <Text className="font-manrope-bold text-14 text-[#111314] leading-[18px] h-fit">
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
                    <View className="flex flex-row w-full rounded-2xl bg-white items-center px-8 py-4 gap-4">
                        <FacebookIcon />
                        <Text className="font-manrope-bold text-14 text-[#111314] leading-[18px] h-fit">
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
