import { create } from "zustand";
import axios from "axios";
import network from "@/network";
import API_PATHS from "@/network/apis";
import replacePlaceholders from "@/utils/replacePlaceholders";
import * as SecureStore from "expo-secure-store";
import { HEADERS_KEYS } from "@/network/constants";
import generateQueryParams from "@/utils/generateQueryParams";

const useFeedStore = create((set, get) => ({
    isFetchingPosts: false,
    hasMorePosts: true,
    updatingLikeId: null,
    trendingFeeds: [],
    forYouFeeds: [],
    trendingOffset: 0,
    postOffset: 0,
    forYouOffset: 0,
    loadingTrending: false,
    loadingForYou: false,
    error: null,
    feeds: {},
    seenPostIds: new Set(),
    forYouPostIds: [],
    postIds: [],
    isFetchingTrending: false,
    isFetchingForYou: false,
    hasMoreTrending: true,
    hasMoreForYou: true,

    removeLike: async (userId, postId) => {
        set({ updatingLikeId: postId });
        network
            .delete(replacePlaceholders(API_PATHS.removeLike, userId, postId))
            .then(() => {
                set((state) => ({
                    feeds: {
                        ...state.feeds,
                        [postId]: {
                            ...state.feeds[postId],
                            postDetails: {
                                ...state.feeds[postId].postDetails,
                                isLiked: false,
                                likesCount:
                                    state.feeds[postId].postDetails.likesCount -
                                    1,
                            },
                        },
                    },
                }));
            })
            .finally(() => {
                set({ updatingLikeId: null });
            });
    },

    addLike: async (userId, postId) => {
        set({ updatingLikeId: postId });
        network
            .post(API_PATHS.addLike, {
                userId,
                postId,
            })
            .then(() => {
                set((state) => ({
                    feeds: {
                        ...state.feeds,
                        [postId]: {
                            ...state.feeds[postId],
                            postDetails: {
                                ...state.feeds[postId].postDetails,
                                isLiked: true,
                                likesCount:
                                    state.feeds[postId].postDetails.likesCount +
                                    1,
                            },
                        },
                    },
                }));
            })
            .finally(() => {
                set({ updatingLikeId: null });
            });
    },

    fetchTrendingFeeds: async (limit) => {
        if (get().isFetchingTrending || !get().hasMoreTrending) {
            return; // Prevent concurrent calls and stop if no more feeds
        }

        set({ loadingTrending: true, isFetchingTrending: true });
        try {
            const response = await axios.get(
                `https://api.example.com/trending`,
                {
                    params: { limit, page: get().trendingOffset },
                }
            );

            const newPosts = response.data.filter(
                (item) => !get().seenPostIds.has(item.postDetails.id)
            );

            if (newPosts.length > 0) {
                set((state) => ({
                    trendingFeeds: [...state.trendingFeeds, ...newPosts],
                    trendingOffset: state.trendingOffset + 1,
                    seenPostIds: new Set([
                        ...state.seenPostIds,
                        ...newPosts.map((item) => item.postDetails.id),
                    ]),
                }));
            } else {
                set({ hasMoreTrending: false }); // No more trending feeds available
            }
        } catch (err) {
            set({ error: err });
        } finally {
            set({ loadingTrending: false, isFetchingTrending: false });
        }
    },

    fetchForYouFeeds: async (limit) => {
        if (get().isFetchingForYou || !get().hasMoreForYou) {
            return; // Prevent concurrent calls and stop if no more feeds
        }

        set({ loadingForYou: true, isFetchingForYou: true, error: null });
        try {
            const userId = await SecureStore.getItemAsync(HEADERS_KEYS.USER_ID);
            const response = await network.get(
                generateQueryParams(
                    replacePlaceholders(API_PATHS.getFeed, userId),
                    {
                        limit,
                        offset: get().forYouOffset,
                    }
                )
            );

            const newPosts = response.filter(
                (item) => !get().forYouPostIds.includes(item.postDetails.id)
            );

            if (newPosts.length > 0) {
                const newFeeds = await newPosts.reduce((acc, crr) => {
                    acc[crr.postDetails.id] = crr;
                    return acc;
                }, {});

                set((state) => ({
                    // forYouFeeds: [...state.forYouFeeds, ...newPosts],
                    feeds: { ...state.feeds, ...newFeeds },
                    forYouOffset: state.forYouOffset + limit,
                    seenPostIds: new Set([
                        ...state.seenPostIds,
                        ...newPosts.map((item) => item.postDetails.id),
                    ]),
                    forYouPostIds: [
                        ...state.forYouPostIds,
                        ...newPosts.map((item) => item.postDetails.id),
                    ],
                }));
            } else {
                set({ hasMoreForYou: false }); // No more 'for you' feeds available
            }
        } catch (err) {
            set({ isFetchingForYou: false, error: err });
        } finally {
            set({ loadingForYou: false, isFetchingForYou: false });
        }
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
                        limit,
                        offset: get().postOffset,
                    }
                )
            );

            const newPosts = response.filter(
                (item) => !get().postIds.includes(item.id)
            );

            if (newPosts.length > 0) {
                const newFeeds = await newPosts.reduce((acc, crr) => {
                    acc[crr.id] = crr;
                    return acc;
                }, {});

                set((state) => ({
                    postIds: [
                        ...state.postIds,
                        ...newPosts.map((post) => post.id),
                    ],
                    feeds: { ...state.feeds, ...newFeeds },
                    postOffset: state.postOffset + 1,
                }));
            } else {
                set({ hasMorePosts: false });
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
            postIds: [],
            postOffset: 0,
            hasMorePosts: true,
        });
    },

    // Reset feeds to initial state
    resetFeeds: () =>
        set({
            postIds: [],
            feeds: {},
            postOffset: 0,
            hasMorePosts: true,
            updatingLikeId: null,
            trendingFeeds: [],
            forYouFeeds: [],
            trendingOffset: 0,
            forYouOffset: 0,
            seenPostIds: new Set(),
            forYouPostIds: [],
            hasMoreTrending: true, // Reset the flag
            hasMoreForYou: true, // Reset the flag
            error: null, // Reset the error state
        }),
}));

export default useFeedStore;
