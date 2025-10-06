// app/redirect.jsx
import Loader from "@/components/Loader";
import network from "@/network";
import API_PATHS from "@/network/apis";
import { HEADERS_KEYS } from "@/network/constants";
import clearAppStorage from "@/utils/clearAppStorage";
import replacePlaceholders from "@/utils/replacePlaceholders";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

export default function Redirect() {
    const { code, refresh, logout } = useLocalSearchParams();
    const router = useRouter();

    useEffect(() => {
        console.log("🔄 Redirect page loaded with params:", {
            code,
            refresh,
            logout,
        });

        // If this is a logout return, clear storage and redirect to login
        if (logout === "true") {
            console.log(
                "🚪 Logout return detected, clearing storage and redirecting to login"
            );
            clearAppStorage().then(() => {
                console.log(
                    "✅ Storage cleared after logout, redirecting to login"
                );
                router.replace("/");
            });
            return;
        }

        // Only clear storage if we have an authorization code (new login)
        if (code) {
            console.log(
                "🔑 Authorization code found, clearing storage for fresh login"
            );
            clearAppStorage().then(() => {
                // Add a small delay to ensure storage is cleared before checking authentication
                setTimeout(() => {
                    handleAuthentication();
                }, 100);
            });
        } else {
            // For existing tokens, just check authentication without clearing storage
            handleAuthentication();
        }
    }, [code, refresh, logout]);

    async function checkIfUserIsValid() {
        const refreshToken = await SecureStore.getItemAsync(
            HEADERS_KEYS.REFRESH_TOKEN
        );
        const userId = await SecureStore.getItemAsync(HEADERS_KEYS.USER_ID);

        if (refresh && refreshToken) {
            await SecureStore.deleteItemAsync(HEADERS_KEYS.TOKEN);
            network
                .post(API_PATHS.refreshToken, { userId, refreshToken })
                .then(onAuthSuccess)
                .catch(onAuthFailure);
        } else {
            network
                .get(replacePlaceholders(API_PATHS.getUserById, userId))
                .then(() => router.replace("/(auth)/home"))
                .catch(() => router.replace("/redirect?refresh=true"));
        }
    }

    async function onAuthFailure(err) {
        // console.error(err);
        await clearAppStorage();
        router.replace("/");
    }

    async function onAuthSuccess(res) {
        const token = res.token;
        const refreshToken = res.refreshToken;
        const userId = res.id ? res.id.toString() : res.userId.toString();

        await SecureStore.setItemAsync(HEADERS_KEYS.TOKEN, token);
        await SecureStore.setItemAsync(
            HEADERS_KEYS.REFRESH_TOKEN,
            refreshToken
        );
        await SecureStore.setItemAsync(HEADERS_KEYS.USER_ID, userId);

        // Store additional user data needed for SmallCase JWT
        if (res.email) {
            await SecureStore.setItemAsync("user_email", res.email);
        }
        if (res.name) {
            await SecureStore.setItemAsync("user_name", res.name);
        }

        console.log("User authentication data stored:", {
            userId,
            email: res.email,
            name: res.name,
        });

        if (res.showOnboardingFlow) {
            router.replace("/onboarding");
        } else {
            router.replace("/(auth)/home");
        }
    }

    async function handleAuthentication() {
        const token = await SecureStore.getItemAsync(HEADERS_KEYS.TOKEN);
        const refreshToken = await SecureStore.getItemAsync(
            HEADERS_KEYS.REFRESH_TOKEN
        );

        console.log(
            "🔍 Authentication check - Token exists:",
            !!token,
            "Refresh token exists:",
            !!refreshToken
        );

        if (code) {
            console.log("🔑 Authorization code found, getting JWT token...");
            network
                .post(API_PATHS.getJwtToken, {
                    authorizationCode: code,
                    redirectUrl: process.env.EXPO_PUBLIC_API_REDIRECT,
                })
                .then(onAuthSuccess)
                .catch(onAuthFailure);
        } else if (token || refreshToken) {
            console.log("🔄 Existing tokens found, checking validity...");
            checkIfUserIsValid();
        } else {
            console.log("❌ No tokens found, redirecting to login...");
            onAuthFailure();
        }
    }

    return <Loader />;
}
