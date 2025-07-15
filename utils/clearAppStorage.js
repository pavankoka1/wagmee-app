import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HEADERS_KEYS } from "@/network/constants";
import useUserStore from "@/hooks/useUserStore";
import useUserSearchStore from "@/hooks/useUserSearchStore";
import useFeedStore from "@/hooks/useFeedStore";
import useActivityStore from "@/hooks/useActivityStore";
import useBottomSheetStore from "@/hooks/useBottomSheetStore";

export default async function clearAppStorage() {
    useUserStore.getState().reset();
    useUserSearchStore.getState().clearCache();
    useFeedStore.getState().resetForYou();
    useFeedStore.getState().resetTrending();
    useFeedStore.getState().resetPosts();
    useActivityStore.getState().setActiveCommentPostId(null);
    useActivityStore.getState().setCommentsById(null, []);
    useBottomSheetStore.getState().closeFollowSheet();
}
