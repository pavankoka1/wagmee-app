import React, { memo, useState, useCallback } from "react";
import { View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { HEADERS_KEYS } from "@/network/constants";
import useFeedStore from "@/hooks/useFeedStore";
import useUserStore from "@/hooks/useUserStore";
import useActivityStore from "@/hooks/useActivityStore";
import {
    PostHeader,
    PostContent,
    PostCarousel,
    PostInteractions,
    ImageViewer,
    PostsLoader,
} from "./feed";

/**
 * Renders a single feed post with header, content, carousel, and interactions.
 * @param {Object} props
 * @param {string} props.id - Post ID
 */
const FeedPost = memo(({ id }) => {
    const userId = SecureStore.getItem(HEADERS_KEYS.USER_ID);
    const { feeds, removeLike, addLike } = useFeedStore();
    const { followers, details, setProfileBottomSheet, activeProfileUserId } =
        useUserStore();
    const { setActiveCommentPostId } = useActivityStore();

    const item = feeds[id];
    if (!item) return <PostsLoader />;

    const postDetails = item.postDetails || item;
    const authorDetails = item.postAuthorDetails || details;

    const [selectedImage, setSelectedImage] = useState(null);

    const handleLikePost = useCallback(() => {
        const func = postDetails.isLiked ? removeLike : addLike;
        func(details.id, postDetails.id);
    }, [postDetails.isLiked, details.id, postDetails.id, removeLike, addLike]);

    const handleComment = useCallback(() => {
        setActiveCommentPostId(postDetails.id);
    }, [postDetails.id, setActiveCommentPostId]);

    const handleImageClick = useCallback((imageUrl) => {
        setSelectedImage(imageUrl);
    }, []);

    const closeImageViewer = useCallback(() => {
        setSelectedImage(null);
    }, []);

    return (
        <>
            <View className="py-6 px-4 border-b-[2px] border-[#1F2023]">
                <PostHeader
                    authorDetails={authorDetails}
                    postDetails={postDetails}
                    userId={userId}
                    followers={followers}
                    details={details}
                    setProfileBottomSheet={setProfileBottomSheet}
                    activeProfileUserId={activeProfileUserId}
                />
                <PostContent content={postDetails.content} />
                <PostCarousel
                    mediaUrls={postDetails.mediaUrls}
                    onImageClick={handleImageClick}
                />
                <PostInteractions
                    postDetails={postDetails}
                    onLike={handleLikePost}
                    onComment={handleComment}
                />
            </View>
            <ImageViewer imageUrl={selectedImage} onClose={closeImageViewer} />
        </>
    );
});

export default FeedPost;
