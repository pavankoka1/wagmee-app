import network from "@/network";
import API_PATHS from "@/network/apis";
import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import replacePlaceholders from "@/utils/replacePlaceholders";
import generateQueryParams from "@/utils/generateQueryParams";
import { ToastAndroid } from "react-native";
import { HEADERS_KEYS } from "@/network/constants";

const useUserStore = create((set, get) => ({
    openSettingsBottomSheet: false,
    activeProfileUserId: null,
    hasMorePosts: true,
    isFetchingPosts: false,
    error: null,
    followers: [],
    following: [],
    posts: [],
    postIds: [],
    postOffset: 0,
    details: {},
    setSettingsBottomSheet: (toggle) =>
        set({ openSettingsBottomSheet: toggle }),
    setProfileBottomSheet: (userId = null) =>
        set({ activeProfileUserId: userId }),
    setUserDetails: (details) => set({ details }),
    setFollowers: (followers) => {
        const followersUserIds = followers.map(
            (follower) => follower.followerId
        );
        set({ followers: followersUserIds });
    },
    addFollower: (userId) =>
        set((state) => ({
            following: [...state.following, userId],
        })),
    removeFollower: (userId) =>
        set((state) => ({
            following: state.following.filter((id) => id !== userId),
        })),
    setFollowing: (following) => {
        const followingUserIds = following.map(
            (following) => following.followeeId
        );
        set({ following: followingUserIds });
    },
    fetchPosts: async (limit = 10) => {
        if (get().isFetchingPosts || !get().hasMorePosts) {
            return; // Prevent concurrent calls and stop if no more feeds
        }

        set({ isFetchingPosts: true, error: null });
        try {
            const userId = await SecureStore.getItemAsync(HEADERS_KEYS.USER_ID);
            const response = await network.get(
                generateQueryParams(
                    replacePlaceholders(API_PATHS.getPosts, userId),
                    {
                        viewerUserId: userId,
                        limit,
                        offset: get().postOffset,
                    }
                )
            );

            const newPosts = response.filter(
                (item) => !get().postIds.includes(item.id)
            );

            if (newPosts.length > 0) {
                set((state) => ({
                    posts: [...state.posts, ...newPosts],
                    postIds: [
                        ...state.postIds,
                        ...newPosts.map((post) => post.id),
                    ],
                    postOffset: state.postOffset + 1,
                }));
            } else {
                set({ hasMorePosts: false }); // No more 'for you' feeds available
            }
        } catch (err) {
            set({ error: err });
            ToastAndroid.showWithGravityAndOffset(
                err.message,
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                25,
                50
            );
        } finally {
            set({ isFetchingPosts: false });
        }
    },
    resetPosts: () => {
        set({
            posts: [],
            postIds: [],
            postOffset: 0,
            hasMorePosts: true,
        });
    },
}));

export default useUserStore;
