import { View, Text, Animated } from "react-native";
import React, { useEffect, useRef, useCallback } from "react";
import useFeedStore from "@/hooks/useFeedStore";
import { Button } from "react-native-paper";
import OptimizedList from "../common/OptimizedList";

const ITEMS_PER_PAGE = 10;

// Memoized empty state component
const EmptyState = React.memo(({ onRefresh }) => (
    <View className="flex-1 flex-col justify-center items-center bg-[#161616]">
        <Text className="text-[#B1B1B1] font-manrope-bold text-16 mb-1">
            No Trending Posts
        </Text>
        <Text className="text-white font-manrope text-14">
            You're caught up, please check For You tab
        </Text>
        <Button
            className="bg-primary-main text-[#292929] font-manrope-bold text-10 py-2 px-4 rounded-xl mt-4"
            onPress={onRefresh}
        >
            Refresh
        </Button>
    </View>
));

const TrendingScreen = () => {
    const {
        isFetchingTrending,
        trendingPostIds,
        fetchTrendingFeeds,
        resetTrending,
        refreshing,
        setRefreshing,
    } = useFeedStore();

    const spinValue = useRef(new Animated.Value(0)).current;

    const startSpin = () => {
        spinValue.setValue(0);
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start(() => startSpin());
    };

    useEffect(() => {
        if (refreshing) {
            startSpin();
        }
    }, [refreshing]);

    useEffect(() => {
        fetchTrendingFeeds(ITEMS_PER_PAGE);
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        resetTrending();
        await fetchTrendingFeeds(ITEMS_PER_PAGE);
        setRefreshing(false);
    }, [resetTrending, fetchTrendingFeeds, setRefreshing]);

    const handleLoadMore = useCallback(() => {
        return fetchTrendingFeeds(ITEMS_PER_PAGE);
    }, [fetchTrendingFeeds]);

    if (!trendingPostIds?.length && !isFetchingTrending) {
        return <EmptyState onRefresh={onRefresh} />;
    }

    return (
        <View className="flex-1 bg-[#161616]">
            <OptimizedList
                data={trendingPostIds}
                isLoading={isFetchingTrending}
                onEndReached={handleLoadMore}
                onRefresh={onRefresh}
                refreshing={refreshing}
                ListEmptyComponent={<EmptyState onRefresh={onRefresh} />}
                keyPrefix="trending"
                className="bg-[#161616]"
            />
        </View>
    );
};

export default React.memo(TrendingScreen);
