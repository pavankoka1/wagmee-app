import { View, Animated, Text } from "react-native";
import React, { useRef, useEffect, useCallback, useState } from "react";
import useFeedStore from "@/hooks/useFeedStore";
import Header from "./Header";
import Card from "./Card";
import TabButton from "@/components/Tabs/TabButton";
import OptimizedList from "../common/OptimizedList";
import { Button } from "react-native-paper";

const Posts = ({ handleTabChange }) => {
    const { isFetchingPosts, postIds, fetchPosts, resetPosts } = useFeedStore();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

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

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        resetPosts();
        await fetchPosts();
        setRefreshing(false);
    }, [resetPosts, fetchPosts]);

    const handleLoadMore = useCallback(() => {
        return fetchPosts();
    }, [fetchPosts]);

    const ListHeader = useCallback(
        () => (
            <View className="border-b-[2px] border-[#1F2023]">
                <Header />
                <Card />
                <View className="flex flex-row">
                    <TabButton title="Portfolio" onPress={handleTabChange} />
                    <TabButton
                        title="Posts"
                        className="border-b-[3px] border-primary-main pb-5"
                        isActive={true}
                    />
                </View>
            </View>
        ),
        [handleTabChange]
    );

    const EmptyState = useCallback(
        () => (
            <View className="flex-1 flex-col justify-center items-center bg-[#161616]">
                <ListHeader />
                <View className="flex-1 flex-col justify-center items-center bg-[#161616]">
                    <Text className="text-[#B1B1B1] font-manrope-bold text-16 mb-1">
                        You haven't posted anything yet!
                    </Text>
                    <Text className="text-white font-manrope text-14 mb-5">
                        Please try to pull down if you've posted just now!
                    </Text>
                    <Button
                        mode="contained"
                        onPress={onRefresh}
                        className="bg-primary-main text-12 !text-[#161616]"
                        style={{
                            paddingVertical: 4,
                            paddingHorizontal: 16,
                            borderRadius: 16,
                        }}
                        labelStyle={{ color: "#161616" }}
                    >
                        Refresh Feed
                    </Button>
                </View>
            </View>
        ),
        [ListHeader, onRefresh]
    );

    if (!postIds.length && !isFetchingPosts) {
        return <EmptyState />;
    }

    return (
        <OptimizedList
            data={postIds}
            isLoading={isFetchingPosts}
            onEndReached={handleLoadMore}
            onRefresh={onRefresh}
            refreshing={refreshing}
            ListHeaderComponent={<ListHeader />}
            keyPrefix="posts"
            className="bg-[#161616]"
        />
    );
};

export default React.memo(Posts);
