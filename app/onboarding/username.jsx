import useUserStore from "@/hooks/useUserStore";
import network from "@/network";
import API_PATHS from "@/network/apis";
import { HEADERS_KEYS } from "@/network/constants";
import replacePlaceholders from "@/utils/replacePlaceholders";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UsernamePage({ onContinue }) {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { details, setUserDetails } = useUserStore();

    async function handleContinue() {
        if (!username) return;
        setLoading(true);
        setError("");
        try {
            const userId = await SecureStore.getItemAsync(HEADERS_KEYS.USER_ID);
            const res = await network.put(
                replacePlaceholders(API_PATHS.updateUserDetails, userId),
                { userName: username }
            );
            setUserDetails({ ...details, ...res });
            onContinue(username);
        } catch (err) {
            // Extract just the user-friendly message, not the full error
            let errorMessage = "Failed to update username. Please try again.";

            if (err.response?.data?.message) {
                // If it's a simple message, use it; otherwise use generic message
                const apiMessage = err.response.data.message;
                if (
                    apiMessage.length < 100 &&
                    !apiMessage.includes("stack") &&
                    !apiMessage.includes("Error:")
                ) {
                    errorMessage = apiMessage;
                }
            }

            setError(errorMessage);

            // Show error based on platform
            if (Platform.OS === "android") {
                ToastAndroid.showWithGravityAndOffset(
                    errorMessage,
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    25,
                    50
                );
            } else {
                Alert.alert("Error", errorMessage);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView
            className="flex-1 bg-[#161616]"
            edges={["top", "left", "right"]}
        >
            <View className="flex-1 px-8 flex flex-col h-full">
                <Text className="text-white font-manrope-light text-32 mb-2 mt-16">
                    Pick Your Username
                </Text>
                <Text className="text-white/90 font-manrope text-14 mb-8">
                    Ensure your privacy by opting for a confidential alias
                </Text>
                <View className="w-full flex-row items-center bg-[#222] rounded-xl mb-2 px-6 py-4">
                    <Text className="text-[#B1B1B1] font-manrope-medium text-18 mr-1">
                        @
                    </Text>
                    <TextInput
                        className="flex-1 text-white font-manrope-medium"
                        placeholder="Enter your username"
                        placeholderTextColor="#B1B1B1"
                        value={username}
                        onChangeText={(text) => {
                            setUsername(text);
                            setError(""); // Clear error when user types
                        }}
                        autoCapitalize="none"
                    />
                </View>
                {error ? (
                    <Text className="text-red-500 font-manrope text-12 mb-2 px-2">
                        {error}
                    </Text>
                ) : null}
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                    className="w-full rounded-full mb-8"
                    style={{
                        backgroundColor: "#B4EF02",
                        opacity: username && !loading ? 1 : 0.5,
                    }}
                    disabled={!username || loading}
                    onPress={handleContinue}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <ActivityIndicator
                            color="#000"
                            style={{ paddingVertical: 16 }}
                        />
                    ) : (
                        <Text className="text-black font-manrope-bold text-14 py-4 text-center">
                            Continue
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
