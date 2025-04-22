import { View, FlatList, RefreshControl, Animated, Text } from "react-native";
import React, { useRef, useEffect, useCallback, useState } from "react";
import useUserStore from "@/hooks/useUserStore";
import FeedPost from "../home/FeedPost";
import Header from "./Header";
import Card from "./Card";
import TabButton from "@/components/Tabs/TabButton";
import useFeedStore from "@/hooks/useFeedStore";

const Posts = ({ handleTabChange }) => {
    const { isFetchingPosts, resetPosts, feeds, postIds, fetchPosts } =
        useFeedStore();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

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

    const onRefresh = async () => {
        setRefreshing(true);
        await resetPosts();
        await fetchPosts();
        setRefreshing(false);
    };

    const renderItem = useCallback(
        ({ item }) => {
            return <FeedPost item={feeds[item]} />;
        },
        [feeds]
    );

    if (!postIds.length && !isFetchingPosts)
        return (
            <View className="flex-1 flex-col justify-center items-center bg-[#161616]">
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
                <View className="flex-1 flex-col justify-center items-center bg-[#161616]">
                    <Text className="text-[#B1B1B1] font-manrope-bold text-16 mb-1">
                        You haven't posted anything yet!
                    </Text>
                    <Text className="text-white font-manrope text-14">
                        Please try to pull down if you've posted just now!
                    </Text>
                </View>
            </View>
        );

    return (
        <FlatList
            data={
                isFetchingPosts ? [...postIds, ...Array(4).fill(null)] : postIds
            }
            renderItem={renderItem}
            keyExtractor={(item) =>
                item ? "post-" + item : "loader-" + Math.random() * 10000
            }
            ListHeaderComponent={
                <View className="border-b-[2px] border-[#1F2023]">
                    <Header />
                    <Card />
                    <View className="flex flex-row">
                        <TabButton
                            title="Portfolio"
                            onPress={handleTabChange}
                        />
                        <TabButton
                            title="Posts"
                            className="border-b-[3px] border-primary-main pb-5"
                            isActive={true}
                        />
                    </View>
                </View>
            }
            onEndReached={() => fetchPosts()}
            onEndReachedThreshold={0.5}
            initialNumToRender={3}
            windowSize={5}
            contentContainerStyle={{ backgroundColor: "#161616" }}
            refreshControl={
                <RefreshControl
                    // refreshing={isFetchingPosts}
                    onRefresh={onRefresh}
                />
            }
        />
    );
};

export default Posts;
