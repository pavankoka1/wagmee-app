import useFeedStore from "@/hooks/useFeedStore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import { Button } from "react-native-paper";
import OptimizedList from "../common/OptimizedList";

const PostsContent = ({ Header, Card, TabButton, activeTab, onTabChange }) => {
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
            <View>
                {/* Shared Header */}
                <Header />

                {/* Shared Card */}
                <Card />

                {/* Shared Tab Navigation */}
                <View className="flex flex-row border-b-[2px] border-[#1F2023]">
                    <TabButton
                        title="Portfolio"
                        className={
                            activeTab === "portfolio"
                                ? "border-b-[3px] border-primary-main pb-5"
                                : ""
                        }
                        isActive={activeTab === "portfolio"}
                        onPress={() => onTabChange("portfolio")}
                    />
                    <TabButton
                        title="Posts"
                        className={
                            activeTab === "posts"
                                ? "border-b-[3px] border-primary-main pb-5"
                                : ""
                        }
                        isActive={activeTab === "posts"}
                        onPress={() => onTabChange("posts")}
                    />
                </View>
            </View>
        ),
        [Header, Card, TabButton, activeTab, onTabChange]
    );

    // For empty state, we need to use a different approach to avoid VirtualizedList nesting
    if (!postIds.length && !isFetchingPosts) {
        return (
            <View className="flex-1 bg-[#161616]">
                {/* Shared Header */}
                <Header />

                {/* Shared Card */}
                <Card />

                {/* Shared Tab Navigation */}
                <View className="flex flex-row border-b-[2px] border-[#1F2023]">
                    <TabButton
                        title="Portfolio"
                        className={
                            activeTab === "portfolio"
                                ? "border-b-[3px] border-primary-main pb-5"
                                : ""
                        }
                        isActive={activeTab === "portfolio"}
                        onPress={() => onTabChange("portfolio")}
                    />
                    <TabButton
                        title="Posts"
                        className={
                            activeTab === "posts"
                                ? "border-b-[3px] border-primary-main pb-5"
                                : ""
                        }
                        isActive={activeTab === "posts"}
                        onPress={() => onTabChange("posts")}
                    />
                </View>

                {/* Empty State Content */}
                <View className="flex-1 flex-col justify-center items-center bg-[#161616] py-20">
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
        );
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

export default React.memo(PostsContent);
