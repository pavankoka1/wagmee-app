import React, { memo } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import ThumbIcon from "@/icons/ThumbIcon";
import MessageIcon from "@/icons/MessageIcon";
import SendIcon from "@/icons/SendIcon";
import BookmarkIcon from "@/icons/BookmarkIcon";

/**
 * Renders the post's interaction buttons (likes, comments, share, bookmark).
 * @param {Object} props
 * @param {Object} props.postDetails - Post details { id, isLiked, likesCount, commentsCount, isLoading }
 * @param {Function} props.onLike - Callback for like/unlike
 * @param {Function} props.onComment - Callback for comment action
 */
const PostInteractions = memo(({ postDetails, onLike, onComment }) => {
    return (
        <View className="flex flex-row items-center mt-3 gap-2">
            <View
                style={{
                    minWidth: 36,
                    alignItems: "center",
                    flexDirection: "row",
                }}
            >
                {postDetails.isLoading ? (
                    <ActivityIndicator size="small" color="#b4ef02" />
                ) : (
                    <View className="flex flex-row items-center">
                        <TouchableOpacity onPress={onLike}>
                            <ThumbIcon
                                color={postDetails.isLiked ? "#b4ef02" : "#fff"}
                                fill={postDetails.isLiked}
                            />
                        </TouchableOpacity>
                        <Text className="font-manrope-medium text-12 text-white ml-1">
                            {postDetails.likesCount}
                        </Text>
                    </View>
                )}
            </View>
            <TouchableOpacity
                className="flex flex-row items-center mr-auto"
                onPress={onComment}
            >
                <MessageIcon />
                <Text className="font-manrope-medium text-12 text-white ml-1 mr-auto">
                    {postDetails.commentsCount}
                </Text>
            </TouchableOpacity>
            <SendIcon />
            <BookmarkIcon />
        </View>
    );
});

export default PostInteractions;
