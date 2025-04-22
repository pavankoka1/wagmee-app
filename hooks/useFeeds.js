import { useEffect, useState } from "react";
import useFeedStore from "./useFeedStore";

const useFeeds = () => {
    const {
        updatingLikeId,
        isFetchingForYou,
        forYouFeeds,
        fetchForYouFeeds,
        loading,
        error,
        resetFeeds,
        forYouPostIds,
        feeds,
    } = useFeedStore();

    const [refreshing, setRefreshing] = useState(false);

    const loadMoreForYou = async (limit) => {
        await fetchForYouFeeds(limit);
    };

    // Initial fetch for 'For You' feeds
    useEffect(() => {
        loadMoreForYou(10); // Fetch initial feeds
    }, []);

    return {
        updatingLikeId,
        isFetchingForYou,
        forYouFeeds,
        loadMoreForYou,
        loading,
        error,
        refreshing,
        setRefreshing,
        resetFeeds,
        forYouPostIds,
        feeds,
    };
};

export default useFeeds;
