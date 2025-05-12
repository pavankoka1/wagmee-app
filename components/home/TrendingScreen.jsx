import { View, Text, FlatList, Animated, RefreshControl } from "react-native";
import React, { useEffect, useRef, useCallback } from "react";
import useFeedStore from "@/hooks/useFeedStore";
import FeedPost from "./FeedPost";
import { Button } from "react-native-paper";

const ITEMS_PER_PAGE = 10;

const TrendingScreen = () => {
    const {
        isFetchingTrending,
        trendingPostIds,
        feeds,
        fetchTrendingFeeds,
        resetTrending,
        refreshing,
        setRefreshing,
    } = useFeedStore();

    const spinValue = useRef(new Animated.Value(0)).current;

    const rotate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

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

    if (!trendingPostIds?.length && !isFetchingTrending) {
        return (
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
        );
    }

    return (
        <View className="flex-1 bg-[#161616]">
            <FlatList
                data={
                    isFetchingTrending
                        ? [...trendingPostIds, ...Array(4).fill(null)]
                        : trendingPostIds
                }
                renderItem={({ item }) => <FeedPost id={item} />}
                keyExtractor={(item) =>
                    item
                        ? "trending-" + item
                        : "loader-" + Math.random() * 10000
                }
                onEndReached={() => fetchTrendingFeeds(ITEMS_PER_PAGE)}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                initialNumToRender={3}
                windowSize={5}
            />
        </View>
    );
};

export default TrendingScreen;
