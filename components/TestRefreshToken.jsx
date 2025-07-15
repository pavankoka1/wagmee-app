import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
    testRefreshToken,
    testRefreshTokenWithRealImplementation,
} from "@/utils/testRefreshToken";

const TestRefreshToken = () => {
    const handleTestBasic = async () => {
        console.log("🧪 Starting basic refresh token test...");
        await testRefreshToken();
    };

    const handleTestWithImplementation = async () => {
        console.log(
            "🧪 Starting refresh token test with real implementation..."
        );
        await testRefreshTokenWithRealImplementation();
    };

    return (
        <View style={{ padding: 20, gap: 10 }}>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
                Refresh Token Test
            </Text>

            <TouchableOpacity
                onPress={handleTestBasic}
                style={{
                    backgroundColor: "#FFD929",
                    padding: 15,
                    borderRadius: 8,
                    alignItems: "center",
                }}
            >
                <Text style={{ color: "#292929", fontWeight: "bold" }}>
                    Test Basic 401 (No Refresh)
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleTestWithImplementation}
                style={{
                    backgroundColor: "#26F037",
                    padding: 15,
                    borderRadius: 8,
                    alignItems: "center",
                }}
            >
                <Text style={{ color: "#292929", fontWeight: "bold" }}>
                    Test With Refresh Implementation
                </Text>
            </TouchableOpacity>

            <Text style={{ color: "#B1B1B1", fontSize: 12, marginTop: 10 }}>
                Check console logs for detailed test results
            </Text>
        </View>
    );
};

export default TestRefreshToken;
