import TickIcon from "@/icons/TickIcon";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";

const EulaAcceptanceModal = ({ isVisible, onAccept, isLoading = false }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleOpenTerms = () => {
        WebBrowser.openBrowserAsync("https://wagmee.in/terms.html");
    };

    const handleOpenPrivacy = () => {
        WebBrowser.openBrowserAsync("https://wagmee.in/privacy.html");
    };

    const handleOpenSafety = () => {
        WebBrowser.openBrowserAsync("https://wagmee.in/saftey-policy.html");
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={false}
            statusBarTranslucent
        >
            <SafeAreaView className="flex-1 bg-[#161616]">
                <View className="flex-1 px-6 pt-8 pb-6">
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >
                        <Text className="font-manrope-bold text-28 text-white mb-6">
                            Welcome to Wagmee!
                        </Text>

                        <Text className="font-manrope text-16 text-white leading-6 mb-6">
                            Before you continue, please review and accept our
                            terms and policies.
                        </Text>

                        <View className="bg-[#1F1F1F] rounded-2xl p-5 mb-6">
                            <Text className="font-manrope-bold text-16 text-white mb-4">
                                Key Points:
                            </Text>

                            <View className="mb-3">
                                <Text className="font-manrope-medium text-14 text-primary-main mb-2">
                                    • Community Guidelines
                                </Text>
                                <Text className="font-manrope text-13 text-[#B1B1B1] pl-4">
                                    We maintain a zero-tolerance policy for
                                    objectionable content including hate speech,
                                    harassment, explicit material, violence,
                                    fraud, or illegal activity.
                                </Text>
                            </View>

                            <View className="mb-3">
                                <Text className="font-manrope-medium text-14 text-primary-main mb-2">
                                    • Content Moderation
                                </Text>
                                <Text className="font-manrope text-13 text-[#B1B1B1] pl-4">
                                    We review all reported content within 24
                                    hours and take immediate action including
                                    content removal and account suspension.
                                </Text>
                            </View>

                            <View className="mb-3">
                                <Text className="font-manrope-medium text-14 text-primary-main mb-2">
                                    • Your Safety
                                </Text>
                                <Text className="font-manrope text-13 text-[#B1B1B1] pl-4">
                                    You can report objectionable content or
                                    block users at any time. We're committed to
                                    maintaining a safe platform for all users.
                                </Text>
                            </View>

                            <View>
                                <Text className="font-manrope-medium text-14 text-primary-main mb-2">
                                    • Informational Purpose
                                </Text>
                                <Text className="font-manrope text-13 text-[#B1B1B1] pl-4">
                                    Wagmee is for educational purposes only. We
                                    do not provide financial or investment
                                    advice.
                                </Text>
                            </View>
                        </View>

                        <View className="bg-[#1F1F1F] rounded-2xl p-5 mb-6">
                            <Text className="font-manrope-bold text-14 text-white mb-3">
                                Read Our Policies:
                            </Text>

                            <TouchableOpacity
                                onPress={handleOpenTerms}
                                className="py-3 border-b border-[#2f2f2f]"
                            >
                                <Text className="font-manrope-medium text-14 text-primary-main">
                                    Terms of Service →
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleOpenPrivacy}
                                className="py-3 border-b border-[#2f2f2f]"
                            >
                                <Text className="font-manrope-medium text-14 text-primary-main">
                                    Privacy Policy →
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleOpenSafety}
                                className="py-3"
                            >
                                <Text className="font-manrope-medium text-14 text-primary-main">
                                    Child Safety Policy →
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={() => setIsChecked(!isChecked)}
                            activeOpacity={0.7}
                            className="flex-row items-start mb-6"
                        >
                            <View
                                className={`w-6 h-6 rounded-md border-2 mr-3 flex items-center justify-center ${
                                    isChecked
                                        ? "bg-primary-main border-primary-main"
                                        : "border-[#444]"
                                }`}
                            >
                                {isChecked && (
                                    <TickIcon color="#161616" size={14} />
                                )}
                            </View>
                            <View className="flex-1">
                                <Text className="font-manrope text-14 text-white leading-5">
                                    I have read and agree to the Terms of
                                    Service, Privacy Policy, and Child Safety
                                    Policy. I understand that objectionable
                                    content is strictly prohibited and may
                                    result in account termination.
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>

                    <TouchableOpacity
                        onPress={onAccept}
                        disabled={!isChecked || isLoading}
                        className={`py-4 rounded-2xl flex items-center ${
                            !isChecked || isLoading
                                ? "bg-[#2A2A2A] opacity-50"
                                : "bg-primary-main"
                        }`}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#161616" />
                        ) : (
                            <Text className="font-manrope-bold text-16 text-[#161616]">
                                Accept and Continue
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

export default EulaAcceptanceModal;
