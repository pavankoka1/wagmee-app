import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React from "react";
import FeedPost from "@/components/home/FeedPost";
import PostsLoader from "@/components/home/feed/PostsLoader";

const UserProfilePosts = ({
    postIds,
    isFetchingUserProfilePosts,
    handleLoadMore,
    error,
}) => {
    // Render FeedPost or PostsLoader
    const renderItem = ({ item }) =>
        item ? <FeedPost id={item} /> : <PostsLoader />;

    // Append shimmer placeholders during fetch
    const data = isFetchingUserProfilePosts
        ? [...postIds, ...Array(4).fill(null)]
        : postIds;

    if (error) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-[#B1B1B1] font-manrope text-14">
                    Failed to fetch posts
                </Text>
            </View>
        );
    }

    if (!postIds.length && !isFetchingUserProfilePosts) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-[#B1B1B1] font-manrope-bold text-16 mb-1">
                    No posts yet!
                </Text>
                <Text className="text-white font-manrope text-14">
                    This user hasn't posted anything.
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
                item ? `post-${item}` : `loader-${index}`
            }
            contentContainerStyle={{
                paddingBottom: 20,
                backgroundColor: "#161616",
            }}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={3}
            windowSize={5}
        />
    );
};

export default UserProfilePosts;
