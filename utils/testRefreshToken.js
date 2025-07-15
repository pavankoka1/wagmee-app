import * as SecureStore from "expo-secure-store";
import { HEADERS_KEYS } from "@/network/constants";
import network from "@/network";
import API_PATHS from "@/network/apis";

export const testRefreshToken = async () => {
    console.log("🧪 Testing refresh token functionality...");

    // Store the current valid token
    const currentToken = await SecureStore.getItemAsync(HEADERS_KEYS.TOKEN);
    const currentRefreshToken = await SecureStore.getItemAsync(
        HEADERS_KEYS.REFRESH_TOKEN
    );

    console.log("Current token exists:", !!currentToken);
    console.log("Current refresh token exists:", !!currentRefreshToken);

    // Set a wrong token
    await SecureStore.setItemAsync(HEADERS_KEYS.TOKEN, "wrong_token_123");
    console.log("✅ Set wrong token for testing");

    try {
        // Make a network call that should fail with 401
        console.log("🔄 Making network call with wrong token...");
        const userId = await SecureStore.getItemAsync(HEADERS_KEYS.USER_ID);
        const response = await network.get(
            API_PATHS.getUserById.replace("{0}", userId)
        );
        console.log("❌ Expected 401 but got success:", response);
    } catch (error) {
        console.log(
            "✅ Got expected error:",
            error.response?.status,
            error.response?.statusText
        );

        if (error.response?.status === 401) {
            console.log("🎉 401 error received as expected!");
            console.log("🔄 Check if refresh token mechanism is working...");
        } else {
            console.log("❌ Unexpected error status:", error.response?.status);
        }
    }

    // Restore the original token
    if (currentToken) {
        await SecureStore.setItemAsync(HEADERS_KEYS.TOKEN, currentToken);
        console.log("✅ Restored original token");
    }
};

export const testRefreshTokenWithRealImplementation = async () => {
    console.log("🧪 Testing refresh token with real implementation...");

    // Store the current valid token
    const currentToken = await SecureStore.getItemAsync(HEADERS_KEYS.TOKEN);
    const currentRefreshToken = await SecureStore.getItemAsync(
        HEADERS_KEYS.REFRESH_TOKEN
    );

    console.log("Current token exists:", !!currentToken);
    console.log("Current refresh token exists:", !!currentRefreshToken);

    // Set a wrong token
    await SecureStore.setItemAsync(HEADERS_KEYS.TOKEN, "wrong_token_123");
    console.log("✅ Set wrong token for testing");

    try {
        // Make a network call that should trigger refresh
        console.log("🔄 Making network call with wrong token...");
        const userId = await SecureStore.getItemAsync(HEADERS_KEYS.USER_ID);
        const response = await network.get(
            API_PATHS.getUserById.replace("{0}", userId)
        );
        console.log("✅ Refresh token worked! Got response:", response);
    } catch (error) {
        console.log(
            "❌ Refresh token failed:",
            error.response?.status,
            error.response?.statusText
        );
    }
};
