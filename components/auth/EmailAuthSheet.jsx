import EmailAuthBottomSheet from "@/components/auth/EmailAuthBottomSheet";
import CloseIcon from "@/icons/CloseIcon";
import React, { useEffect, useRef } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EmailAuthSheet = ({
    isOpen,
    onClose,
    isSignUp,
    setIsSignUp,
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    isLoading,
    onSubmit,
}) => {
    const slideAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(slideAnimation, {
            toValue: isSignUp ? Dimensions.get("window").width / 2 - 24 : 0,
            useNativeDriver: false,
            tension: 50,
            friction: 7,
        }).start();
    }, [isSignUp]);

    return (
        <EmailAuthBottomSheet
            isOpen={isOpen}
            onClose={onClose}
            className="pb-0"
        >
            <SafeAreaView edges={["bottom"]} className="bg-[#161616]">
                <View className="px-6 pt-10 pb-10" style={{ minHeight: 500 }}>
                    {/* Close Icon */}
                    <TouchableOpacity
                        onPress={onClose}
                        className="absolute right-6 top-6 z-10 p-2"
                    >
                        <CloseIcon color="white" size={12} />
                    </TouchableOpacity>

                    {/* Toggle between Sign In and Sign Up - Tab Style */}
                    <View className="mt-2 mb-6">
                        <View className="flex flex-row">
                            <TouchableOpacity
                                onPress={() => {
                                    setIsSignUp(false);
                                    setEmail("");
                                    setPassword("");
                                    setName("");
                                }}
                                className="flex-1"
                                style={{ paddingVertical: 20 }}
                            >
                                <Text
                                    style={{
                                        color: !isSignUp
                                            ? "#b4ef02"
                                            : "#666666",
                                        fontSize: 14,
                                        fontFamily: "Manrope-Bold",
                                        textAlign: "center",
                                    }}
                                    adjustsFontSizeToFit
                                    minimumFontScale={0.9}
                                    numberOfLines={1}
                                >
                                    Sign In
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setIsSignUp(true);
                                    setEmail("");
                                    setPassword("");
                                    setName("");
                                }}
                                className="flex-1"
                                style={{ paddingVertical: 20 }}
                            >
                                <Text
                                    style={{
                                        color: isSignUp ? "#b4ef02" : "#666666",
                                        fontSize: 14,
                                        fontFamily: "Manrope-Bold",
                                        textAlign: "center",
                                    }}
                                    adjustsFontSizeToFit
                                    minimumFontScale={0.9}
                                    numberOfLines={1}
                                >
                                    Sign Up
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {/* Animated Indicator */}
                        <Animated.View
                            style={{
                                position: "absolute",
                                bottom: 0,
                                height: 3,
                                width: "50%",
                                backgroundColor: "#b4ef02",
                                left: slideAnimation,
                            }}
                        />
                    </View>

                    {/* Form Container - Fixed height with flex to push button to bottom */}
                    <View
                        style={{ flex: 1, justifyContent: "space-between" }}
                        className="mt-6"
                    >
                        {/* Form Fields */}
                        <View className="flex gap-4">
                            {isSignUp && (
                                <TextInput
                                    className="w-full rounded-2xl bg-white px-5 py-4 font-manrope text-14 text-[#111314]"
                                    placeholder="Full Name"
                                    placeholderTextColor="#B1B1B1"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                    editable={!isLoading}
                                />
                            )}
                            <TextInput
                                className="w-full rounded-2xl bg-white px-5 py-4 font-manrope text-14 text-[#111314]"
                                placeholder="Email"
                                placeholderTextColor="#B1B1B1"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoComplete="email"
                                editable={!isLoading}
                            />
                            <TextInput
                                className="w-full rounded-2xl bg-white px-5 py-4 font-manrope text-14 text-[#111314]"
                                placeholder="Password"
                                placeholderTextColor="#B1B1B1"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoCapitalize="none"
                                autoComplete="password"
                                editable={!isLoading}
                            />
                        </View>

                        {/* Submit Button - Always at bottom */}
                        <TouchableOpacity
                            onPress={onSubmit}
                            disabled={isLoading}
                            className="mt-6"
                        >
                            <View className="flex flex-row w-full rounded-2xl bg-[#b4ef02] items-center justify-center px-8 py-5 gap-4">
                                {isLoading ? (
                                    <ActivityIndicator color="#000000" />
                                ) : (
                                    <Text
                                        className="font-manrope-bold text-14 text-[#000000] leading-[20px]"
                                        adjustsFontSizeToFit
                                        minimumFontScale={0.9}
                                        numberOfLines={1}
                                    >
                                        {isSignUp ? "Sign Up" : "Sign In"}
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </EmailAuthBottomSheet>
    );
};

export default EmailAuthSheet;
