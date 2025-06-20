// app/redirect.jsx
import { useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Loader from "@/components/Loader";
import network from "@/network";
import API_PATHS from "@/network/apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HEADERS_KEYS } from "@/network/constants";
import * as SecureStore from "expo-secure-store";
import replacePlaceholders from "@/utils/replacePlaceholders";

export default function Redirect() {
    const { code, refresh } = useLocalSearchParams();
    const router = useRouter();

    useEffect(() => {
        handleAuthentication();
    }, [code, refresh]);

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
        await SecureStore.deleteItemAsync(HEADERS_KEYS.TOKEN);
        await SecureStore.deleteItemAsync(HEADERS_KEYS.REFRESH_TOKEN);
        await SecureStore.deleteItemAsync(HEADERS_KEYS.USER_ID);
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
        if (res.showOnboardingFlow) {
            router.replace("/onboarding");
        } else {
            router.replace("/(auth)/home");
        }
    }

    async function handleAuthentication() {
        const token = await SecureStore.getItemAsync(HEADERS_KEYS.TOKEN);

        if (code) {
            network
                .post(API_PATHS.getJwtToken, {
                    authorizationCode: code,
                    redirectUrl: process.env.EXPO_PUBLIC_API_REDIRECT,
                })
                .then(onAuthSuccess)
                .catch(onAuthFailure);
        } else if (token) {
            checkIfUserIsValid();
        } else {
            onAuthFailure();
        }
    }

    return <Loader />;
}
