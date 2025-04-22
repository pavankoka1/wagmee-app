import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/context/ThemeContext";
import { useEffect } from "react";
import loadFonts from "@/styles/fonts";
import { tokenCache } from "@/utils/cache";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import {
    PaperProvider,
    MD3LightTheme as DefaultTheme,
} from "react-native-paper";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { enableScreens } from "react-native-screens";

import "@/global.css";
import "@/styles/index.css";

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: "#b4ef02",
        secondary: "#ffffff",
    },
};

enableScreens(true);

export default function RootLayout() {
    useEffect(() => {
        const load = async () => {
            await loadFonts();
        };
        load();
    }, []);

    return (
        <PaperProvider theme={theme}>
            <ThemeProvider>
                <SafeAreaProvider>
                    <StatusBar
                        style="light" // Use light icons (white) for dark backgrounds
                        backgroundColor="#161616" // Dark background color
                        translucent={false} // Ensure the status bar is not translucent
                    />
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen
                            name="index"
                            options={{ title: "Koka Portfolio" }}
                        />
                        <Stack.Screen
                            name="redirect"
                            options={{ title: "Koka Portfolio" }}
                        />
                    </Stack>
                </SafeAreaProvider>
            </ThemeProvider>
        </PaperProvider>
    );
}
