import useActivityStore from "@/hooks/useActivityStore";
import useBottomSheetStore from "@/hooks/useBottomSheetStore";
import useFeedStore from "@/hooks/useFeedStore";
import useUserSearchStore from "@/hooks/useUserSearchStore";
import useUserStore from "@/hooks/useUserStore";
import { HEADERS_KEYS } from "@/network/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export default async function clearAppStorage() {
    console.log("🧹 Starting clearAppStorage...");

    // Clear Zustand stores
    console.log("🔄 Clearing Zustand stores...");
    useUserStore.getState().reset();
    useUserSearchStore.getState().clearCache();
    useFeedStore.getState().resetForYou();
    useFeedStore.getState().resetTrending();
    useFeedStore.getState().resetPosts();
    useActivityStore.getState().setActiveCommentPostId(null);
    useActivityStore.getState().setCommentsById(null, []);
    useBottomSheetStore.getState().closeFollowSheet();

    // Clear SecureStore tokens
    console.log("🔐 Clearing SecureStore tokens...");
    try {
        await SecureStore.deleteItemAsync(HEADERS_KEYS.TOKEN);
        await SecureStore.deleteItemAsync(HEADERS_KEYS.REFRESH_TOKEN);
        await SecureStore.deleteItemAsync(HEADERS_KEYS.USER_ID);
        await SecureStore.deleteItemAsync(HEADERS_KEYS.SMALLCASE_AUTH_TOKEN);
        await SecureStore.deleteItemAsync("user_email");
        await SecureStore.deleteItemAsync("user_name");
        console.log("✅ SecureStore cleared successfully");
    } catch (error) {
        console.error("❌ Error clearing SecureStore:", error);
    }

    // Clear AsyncStorage as well
    console.log("💾 Clearing AsyncStorage...");
    try {
        await AsyncStorage.clear();
        console.log("✅ AsyncStorage cleared successfully");
    } catch (error) {
        console.error("❌ Error clearing AsyncStorage:", error);
    }

    // Add a small delay to ensure all operations complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log("🎉 clearAppStorage completed");
}
