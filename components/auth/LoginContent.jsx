import AppleIcon from "@/icons/AppleIcon";
import FacebookIcon from "@/icons/FacebookIcon";
import GoogleIcon from "@/icons/GoogleIcon";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
    Alert,
    Linking,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// This ensures the browser closes automatically after redirect
WebBrowser.maybeCompleteAuthSession();

const LoginContent = ({ onLoginPress, code, codeVerifier }) => {
    // Check if we're on iOS to show Apple Sign In
    const isIOS = Platform.OS === "ios";

    const openAuthUrl = async (connection = null) => {
        const redirectUri = "tradetribe://redirect";

        // Build Auth0 URL - using correct domain: auth0.wagmee.in
        // If connection is specified (e.g., 'apple'), Auth0 will use that provider
        let authUrl =
            `https://auth0.wagmee.in/authorize?` +
            `response_type=code&` +
            `client_id=sQhMHMtJ2ja30w3nMiKA4yTyN2m8CkbR&` +
            `redirect_uri=${redirectUri}&` +
            `scope=openid profile email`;

        // Check if we're coming from a logout - if so, force fresh login
        // This allows users to login with different accounts after logout
        const isFromLogout = await SecureStore.getItemAsync("is_from_logout");
        console.log("🔍 Checking logout flag:", isFromLogout);
        if (isFromLogout === "true") {
            authUrl += `&prompt=login`; // Force fresh login after logout
            // Clear the flag after using it
            await SecureStore.deleteItemAsync("is_from_logout");
            console.log(
                "🔄 Post-logout login detected, forcing fresh login with prompt=login"
            );
        } else {
            console.log("🔄 Normal login flow, no prompt=login");
        }

        // If specific connection (Apple/Google/Facebook) is requested, add it
        if (connection) {
            authUrl += `&connection=${connection}`;
            console.log(`🔐 Opening Auth0 with ${connection} connection...`);
        } else {
            console.log("🌐 Opening Auth0 Universal Login...");
        }

        try {
            console.log("Auth URL:", authUrl);

            // Use Linking - opens external Safari
            await Linking.openURL(authUrl);

            console.log("✅ External browser opened successfully");
        } catch (err) {
            console.error("Auth error:", err);
            Alert.alert(
                "Error",
                "Failed to open authentication: " + err.message
            );
        }
    };

    return (
        <>
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
                    <Text className="text-white h-[3px] w-[3px] bg-primary-main rounded-full" />
                    <Text className="font-manrope text-white leading-[22px]">
                        Share
                    </Text>
                    <Text className="text-white h-[3px] w-[3px] bg-primary-main rounded-full" />
                    <Text className="font-manrope text-white leading-[22px]">
                        Invest
                    </Text>
                </View>
            </View>
            <View className="flex gap-2">
                {/* Apple Sign In - Required by Apple (Guideline 4.8) - Only on iOS */}
                {isIOS && (
                    <TouchableOpacity onPress={() => openAuthUrl("apple")}>
                        <View className="flex flex-row w-full rounded-2xl bg-white items-center px-8 py-5 gap-4">
                            <AppleIcon />
                            <Text className="font-manrope-bold text-14 text-[#111314] leading-[20px] flex-1">
                                Continue with Apple
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}

                {/* Show "OR" divider if on iOS */}
                {isIOS && (
                    <View className="flex flex-row gap-4 items-center">
                        <Text className="h-[1px] flex-1 bg-[#2f2f2f]" />
                        <Text className="font-manrope text-10 text-white">
                            OR
                        </Text>
                        <Text className="h-[1px] flex-1 bg-[#2f2f2f]" />
                    </View>
                )}

                <TouchableOpacity onPress={() => openAuthUrl("google-oauth2")}>
                    <View className="flex flex-row w-full rounded-2xl bg-white items-center px-8 py-5 gap-4">
                        <GoogleIcon />
                        <Text className="font-manrope-bold text-14 text-[#111314] leading-[20px] flex-1">
                            Continue with Google account
                        </Text>
                    </View>
                </TouchableOpacity>
                <View className="flex flex-row gap-4 items-center">
                    <Text className="h-[1px] flex-1 bg-[#2f2f2f]" />
                    <Text className="font-manrope text-10 text-white">OR</Text>
                    <Text className="h-[1px] flex-1 bg-[#2f2f2f]" />
                </View>
                <TouchableOpacity onPress={() => openAuthUrl("facebook")}>
                    <View className="flex flex-row w-full rounded-2xl bg-white items-center px-8 py-5 gap-4">
                        <FacebookIcon />
                        <Text className="font-manrope-bold text-14 text-[#111314] leading-[20px] flex-1">
                            Continue with Facebook account
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View className="mt-6 px-4">
                <Text className="font-manrope text-11 text-[#B1B1B1] text-center leading-5">
                    By continuing, you agree to Wagmee's{" "}
                    <Text
                        className="text-primary-main underline"
                        onPress={() => {
                            WebBrowser.openBrowserAsync(
                                "https://wagmee.in/terms.html"
                            );
                        }}
                    >
                        Terms of Service
                    </Text>
                    ,{" "}
                    <Text
                        className="text-primary-main underline"
                        onPress={() => {
                            WebBrowser.openBrowserAsync(
                                "https://wagmee.in/privacy.html"
                            );
                        }}
                    >
                        Privacy Policy
                    </Text>
                    , and{" "}
                    <Text
                        className="text-primary-main underline"
                        onPress={() => {
                            WebBrowser.openBrowserAsync(
                                "https://wagmee.in/saftey-policy.html"
                            );
                        }}
                    >
                        Child Safety Policy
                    </Text>
                    .
                </Text>
            </View>
        </>
    );
};

export default LoginContent;
