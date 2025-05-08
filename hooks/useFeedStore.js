import { create } from "zustand";
import axios from "axios";
import network from "@/network";
import API_PATHS from "@/network/apis";
import replacePlaceholders from "@/utils/replacePlaceholders";
import * as SecureStore from "expo-secure-store";
import { HEADERS_KEYS } from "@/network/constants";
import generateQueryParams from "@/utils/generateQueryParams";
import { produce } from "immer";

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
        try {
            await network.delete(
                replacePlaceholders(API_PATHS.removeLike, userId, postId)
            );
            set(
                produce((state) => {
                    if (state.feeds[postId]) {
                        if (state.feeds[postId].postDetails) {
                            state.feeds[postId].postDetails.isLiked = false;
                            state.feeds[postId].postDetails.likesCount -= 1;
                        } else {
                            state.feeds[postId].isLiked = false;
                            state.feeds[postId].likesCount -= 1;
                        }
                    }
                })
            );
        } finally {
            set({ updatingLikeId: null });
        }
    },

    addLike: async (userId, postId) => {
        set({ updatingLikeId: postId });
        try {
            await network.post(API_PATHS.addLike, {
                userId,
                postId,
            });
            set(
                produce((state) => {
                    if (state.feeds[postId]) {
                        if (state.feeds[postId].postDetails) {
                            state.feeds[postId].postDetails.isLiked = true;
                            state.feeds[postId].postDetails.likesCount += 1;
                        } else {
                            state.feeds[postId].isLiked = true;
                            state.feeds[postId].likesCount += 1;
                        }
                    }
                })
            );
        } finally {
            set({ updatingLikeId: null });
        }
    },

    fetchTrendingFeeds: async (limit) => {
        if (get().isFetchingTrending || !get().hasMoreTrending) {
            return;
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

            set(
                produce((state) => {
                    if (newPosts.length > 0) {
                        state.trendingFeeds.push(...newPosts);
                        state.trendingOffset += 1;
                        newPosts.forEach((item) => {
                            state.seenPostIds.add(item.postDetails.id);
                        });
                    } else {
                        state.hasMoreTrending = false;
                    }
                })
            );
        } catch (err) {
            set({ error: err });
        } finally {
            set({ loadingTrending: false, isFetchingTrending: false });
        }
    },

    fetchForYouFeeds: async (limit) => {
        if (get().isFetchingForYou || !get().hasMoreForYou) {
            return;
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

            set(
                produce((state) => {
                    if (newPosts.length > 0) {
                        newPosts.forEach((item) => {
                            state.feeds[item.postDetails.id] = item;
                            state.forYouPostIds.push(item.postDetails.id);
                        });
                        state.forYouOffset += limit;
                    } else {
                        state.hasMoreForYou = false;
                    }
                })
            );
        } catch (err) {
            set({ isFetchingForYou: false, error: err });
        } finally {
            set({ loadingForYou: false, isFetchingForYou: false });
        }
    },

    fetchPosts: async (limit = 10) => {
        if (get().isFetchingPosts || !get().hasMorePosts) {
            return;
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

            set(
                produce((state) => {
                    if (newPosts.length > 0) {
                        newPosts.forEach((item) => {
                            state.feeds[item.id] = item;
                            state.postIds.push(item.id);
                        });
                        state.postOffset += 1;
                    } else {
                        state.hasMorePosts = false;
                    }
                })
            );
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
        set(
            produce((state) => {
                state.postIds = [];
                state.postOffset = 0;
                state.hasMorePosts = true;
            })
        );
    },

    resetFeeds: () => {
        set(
            produce((state) => {
                state.postIds = [];
                state.feeds = {};
                state.postOffset = 0;
                state.hasMorePosts = true;
                state.updatingLikeId = null;
                state.trendingFeeds = [];
                state.forYouFeeds = [];
                state.trendingOffset = 0;
                state.forYouOffset = 0;
                state.seenPostIds = new Set();
                state.forYouPostIds = [];
                state.hasMoreTrending = true;
                state.hasMoreForYou = true;
                state.error = null;
            })
        );
    },
}));

export default useFeedStore;
