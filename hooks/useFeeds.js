import { useEffect } from "react";
import useFeedStore from "./useFeedStore";

const useFeeds = () => {
    const {
        isFetchingPosts,
        hasMorePosts,
        trendingFeeds,
        forYouFeeds,
        trendingOffset,
        postOffset,
        forYouOffset,
        loadingTrending,
        loadingForYou,
        error,
        feeds,
        seenPostIds,
        forYouPostIds,
        postIds,
        trendingPostIds,
        isFetchingTrending,
        isFetchingForYou,
        hasMoreTrending,
        hasMoreForYou,
        fetchTrendingFeeds,
        fetchForYouFeeds,
        fetchPosts,
        resetPosts,
        resetFeeds,
        addLike,
        removeLike,
        refreshing,
        setRefreshing,
    } = useFeedStore();

    const loadMoreTrending = async (limit) => {
        if (!isFetchingTrending && hasMoreTrending) {
            await fetchTrendingFeeds(limit);
        }
    };

    const loadMoreForYou = async (limit) => {
        if (!isFetchingForYou && hasMoreForYou) {
            await fetchForYouFeeds(limit);
        }
    };

    const loadMorePosts = async (limit) => {
        if (!isFetchingPosts && hasMorePosts) {
            await fetchPosts(limit);
        }
    };

    useEffect(() => {
        fetchTrendingFeeds(10);
        fetchForYouFeeds(10);
        fetchPosts(10);
    }, []);

    return {
        isFetchingPosts,
        hasMorePosts,
        trendingFeeds,
        forYouFeeds,
        trendingOffset,
        postOffset,
        forYouOffset,
        loadingTrending,
        loadingForYou,
        error,
        feeds,
        seenPostIds,
        forYouPostIds,
        postIds,
        trendingPostIds,
        isFetchingTrending,
        isFetchingForYou,
        hasMoreTrending,
        hasMoreForYou,
        loadMoreTrending,
        loadMoreForYou,
        loadMorePosts,
        resetPosts,
        resetFeeds,
        addLike,
        removeLike,
        refreshing,
        setRefreshing,
    };
};

export default useFeeds;
