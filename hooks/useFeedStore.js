import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import network from "@/network";
import API_PATHS from "@/network/apis";
import * as SecureStore from "expo-secure-store";
import { HEADERS_KEYS } from "@/network/constants";
import generateQueryParams from "@/utils/generateQueryParams";
import { produce } from "immer";
import replacePlaceholders from "@/utils/replacePlaceholders";

const useFeedStore = create(
    subscribeWithSelector((set, get) => ({
        isFetchingPosts: false,
        hasMorePosts: true,
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
        trendingPostIds: [],
        isFetchingTrending: false,
        isFetchingForYou: false,
        hasMoreTrending: true,
        hasMoreForYou: true,
        refreshing: false,
        userProfilePostIds: {},
        userProfileOffsets: {},
        hasMoreProfilePosts: {},
        isFetchingUserProfilePosts: false,

        setRefreshing: (value) => set({ refreshing: value }),

        removeLike: async (userId, postId) => {
            console.log(`removeLike called for postId: ${postId}`);
            set(
                produce((state) => {
                    if (state.feeds[postId].postDetails) {
                        state.feeds[postId].postDetails.isLoading = true;
                    } else {
                        state.feeds[postId].isLoading = true;
                    }
                })
            );
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
                                state.feeds[
                                    postId
                                ].postDetails.isLoading = false;
                            } else {
                                state.feeds[postId].isLiked = false;
                                state.feeds[postId].likesCount -= 1;
                                state.feeds[postId].isLoading = false;
                            }
                        }
                    })
                );
            } catch (error) {
                set(
                    produce((state) => {
                        if (state.feeds[postId].postDetails) {
                            state.feeds[postId].postDetails.isLoading = false;
                        } else {
                            state.feeds[postId].isLoading = false;
                        }
                    })
                );
            }
        },

        addLike: async (userId, postId) => {
            console.log(`addLike called for postId: ${postId}`);
            set(
                produce((state) => {
                    if (state.feeds[postId].postDetails) {
                        state.feeds[postId].postDetails.isLoading = true;
                    } else {
                        state.feeds[postId].isLoading = true;
                    }
                })
            );
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
                        if (state.feeds[postId].postDetails) {
                            state.feeds[postId].postDetails.isLoading = false;
                        } else {
                            state.feeds[postId].isLoading = false;
                        }
                    })
                );
            } catch (error) {
                set(
                    produce((state) => {
                        if (state.feeds[postId].postDetails) {
                            state.feeds[postId].postDetails.isLoading = false;
                        } else {
                            state.feeds[postId].isLoading = false;
                        }
                    })
                );
            }
        },

        fetchTrendingFeeds: async (limit) => {
            if (get().isFetchingTrending || !get().hasMoreTrending) {
                return;
            }

            set({
                loadingTrending: true,
                isFetchingTrending: true,
                error: null,
            });
            try {
                const userId = await SecureStore.getItemAsync(
                    HEADERS_KEYS.USER_ID
                );
                const response = await network.get(
                    generateQueryParams(API_PATHS.getTrendingPosts, {
                        userId,
                        offset: get().trendingOffset,
                        limit,
                    })
                );

                const newPosts = response.filter(
                    (item) => !get().trendingPostIds.includes(item.id)
                );

                set(
                    produce((state) => {
                        if (newPosts.length > 0) {
                            newPosts.forEach((item) => {
                                state.feeds[item.id] = {
                                    postDetails: item,
                                    isLoading: false,
                                    isLiked: false,
                                    likesCount: item.likesCount,
                                    commentsCount: item.commentsCount,
                                };
                                state.trendingPostIds.push(item.id);
                            });
                            state.trendingOffset += limit;
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
                const userId = await SecureStore.getItemAsync(
                    HEADERS_KEYS.USER_ID
                );
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
                                state.feeds[item.postDetails.id] = {
                                    ...item,
                                    isLoading: false,
                                };
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

            console.log("fetchPosts called");
            set({ isFetchingPosts: true, error: null });
            try {
                const userId = await SecureStore.getItemAsync(
                    HEADERS_KEYS.USER_ID
                );
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
                                state.feeds[item.id] = {
                                    ...item,
                                    isLoading: false,
                                };
                                state.postIds.push(item.id);
                            });
                            state.postOffset += limit;
                        } else {
                            state.hasMorePosts = false;
                        }
                    })
                );
            } catch (err) {
                set({ error: err });
            } finally {
                set({ isFetchingPosts: false });
            }
        },

        fetchUserProfilePosts: async (
            userId,
            userDetails,
            limit = 10,
            offset = 0
        ) => {
            if (get().isFetchingUserProfilePosts) {
                return;
            }

            set({ isFetchingUserProfilePosts: true, error: null });
            try {
                const response = await network.get(
                    generateQueryParams(
                        replacePlaceholders(API_PATHS.getPosts, userId),
                        {
                            limit,
                            offset,
                        }
                    )
                );

                const newPosts = response.filter(
                    (item) =>
                        !get().userProfilePostIds[userId]?.includes(item.id)
                );

                set(
                    produce((state) => {
                        if (newPosts.length > 0) {
                            newPosts.forEach((item) => {
                                if (!state.feeds[item.id]) {
                                    state.feeds[item.id] = {
                                        postDetails: {
                                            ...item,
                                            isLoading: false,
                                        },
                                        postAuthorDetails: userDetails,
                                    };
                                }
                            });
                            state.userProfilePostIds[userId] = [
                                ...(state.userProfilePostIds[userId] || []),
                                ...newPosts.map((item) => item.id),
                            ];
                            state.userProfileOffsets[userId] =
                                (state.userProfileOffsets[userId] || 0) + limit;
                            state.hasMoreProfilePosts[userId] = true;
                        } else {
                            state.hasMoreProfilePosts[userId] = false;
                        }
                    })
                );
            } catch (err) {
                set({ error: err });
            } finally {
                set({ isFetchingUserProfilePosts: false });
            }
        },

        resetForYou: () => {
            console.log("resetForYou called");
            set(
                produce((state) => {
                    state.forYouPostIds = [];
                    state.forYouOffset = 0;
                    state.hasMoreForYou = true;
                    state.error = null;
                })
            );
        },

        resetTrending: () => {
            console.log("resetTrending called");
            set(
                produce((state) => {
                    state.trendingPostIds = [];
                    state.trendingOffset = 0;
                    state.hasMoreTrending = true;
                    state.error = null;
                })
            );
        },

        resetPosts: () => {
            console.log("resetPosts called");
            set(
                produce((state) => {
                    state.postIds = [];
                    state.postOffset = 0;
                    state.hasMorePosts = true;
                    state.error = null;
                })
            );
        },
    }))
);

export default useFeedStore;
