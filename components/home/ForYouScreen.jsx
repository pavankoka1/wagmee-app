import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    Animated,
    RefreshControl,
} from "react-native";
import React, { useEffect, useRef, useCallback } from "react";
import useFeedStore from "@/hooks/useFeedStore";
import FeedPost from "./FeedPost";
import { Button } from "react-native-paper";
import CommentsBottomSheet from "./CommentsBottomSheet";

const ITEMS_PER_PAGE = 10;

const ForYouScreen = () => {
    const {
        isFetchingForYou,
        forYouPostIds,
        feeds,
        fetchForYouFeeds,
        resetForYou,
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
        fetchForYouFeeds(ITEMS_PER_PAGE);
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        resetForYou();
        await fetchForYouFeeds(ITEMS_PER_PAGE);
        setRefreshing(false);
    }, [resetForYou, fetchForYouFeeds, setRefreshing]);

    if (!forYouPostIds.length && !isFetchingForYou) {
        return (
            <View className="flex-1 flex-col justify-center items-center bg-[#161616]">
                <Text className="text-[#B1B1B1] font-manrope-bold text-16 mb-1">
                    No Posts for you so far
                </Text>
                <Text className="text-white font-manrope text-14">
                    Please search & follow the users to get the feed
                </Text>
                <Button
                    className="bg-primary-main text-[#292929] font-manrope-bold text-10 py-2 px-4 rounded-xl"
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
                    isFetchingForYou
                        ? [...forYouPostIds, ...Array(4).fill(null)]
                        : forYouPostIds
                }
                renderItem={({ item }) => <FeedPost id={item} />}
                keyExtractor={(item) =>
                    item ? "for-you-" + item : "loader-" + Math.random() * 10000
                }
                onEndReached={() => fetchForYouFeeds(ITEMS_PER_PAGE)}
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

export default ForYouScreen;
