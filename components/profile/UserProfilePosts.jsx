import { View, Text } from "react-native";
import React from "react";
import OptimizedList from "../common/OptimizedList";

const UserProfilePosts = ({
    postIds,
    isFetchingUserProfilePosts,
    handleLoadMore,
    error,
}) => {
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
        <OptimizedList
            data={postIds}
            isLoading={isFetchingUserProfilePosts}
            onEndReached={handleLoadMore}
            keyPrefix="profile"
            className="bg-[#161616]"
            contentContainerStyle={{
                paddingBottom: 20,
            }}
        />
    );
};

export default React.memo(UserProfilePosts);
