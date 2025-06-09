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
));

const ForYouScreen = () => {
    const {
        isFetchingForYou,
        forYouPostIds,
        fetchForYouFeeds,
        resetForYou,
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
        fetchForYouFeeds(ITEMS_PER_PAGE * 2);
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        resetForYou();
        await fetchForYouFeeds(ITEMS_PER_PAGE);
        setRefreshing(false);
    }, [resetForYou, fetchForYouFeeds, setRefreshing]);

    const handleLoadMore = useCallback(() => {
        return fetchForYouFeeds(ITEMS_PER_PAGE * 2);
    }, [fetchForYouFeeds]);

    if (!forYouPostIds.length && !isFetchingForYou) {
        return <EmptyState onRefresh={onRefresh} />;
    }

    return (
        <View className="flex-1 bg-[#161616]">
            <OptimizedList
                data={forYouPostIds}
                isLoading={isFetchingForYou}
                onEndReached={handleLoadMore}
                onRefresh={onRefresh}
                refreshing={refreshing}
                ListEmptyComponent={<EmptyState onRefresh={onRefresh} />}
                keyPrefix="for-you"
                className="bg-[#161616]"
            />
        </View>
    );
};

export default React.memo(ForYouScreen);
