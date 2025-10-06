import LoginScreen from "@/components/auth/Login";
import { HEADERS_KEYS } from "@/network/constants";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
    useEffect(() => {
        const checkAuthToken = async () => {
            try {
                const token = await SecureStore.getItemAsync(
                    HEADERS_KEYS.TOKEN
                );
                console.log("Stored token:", token);

                if (token) {
                    router.replace("/redirect");
                } else {
                    console.log("🧹 No token found, showing login screen");
                }
            } catch (error) {
                console.error("Token check failed:", error);
            }
        };

        checkAuthToken();
    }, [router]);

    return (
        <SafeAreaProvider>
            <LoginScreen />
        </SafeAreaProvider>
    );
}
