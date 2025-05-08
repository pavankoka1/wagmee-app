import React, { useRef, useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    Image,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import VerifiedIcon from "@/icons/VerifiedIcon";
import moment from "moment";
import ThumbIcon from "@/icons/ThumbIcon";
import MessageIcon from "@/icons/MessageIcon";
import SendIcon from "@/icons/SendIcon";
import BookmarkIcon from "@/icons/BookmarkIcon";
import ThreeDotsIcon from "@/icons/ThreeDotsIcon";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import PostsLoader from "./PostsLoader";
import { useAdvancedSettings } from "@/hooks/useSettings";
import { SlideItem } from "../SlideItem";
import useUserStore from "@/hooks/useUserStore";
import CommentsBottomSheet from "./CommentsBottomSheet";
import { Portal } from "react-native-paper";
import useActivityStore from "@/hooks/useActivityStore";
import useFeedStore from "@/hooks/useFeedStore";

const FeedPost = React.memo(({ id }) => {
    const { feeds } = useFeedStore();
    const item = feeds[id];
    if (!item) return <PostsLoader />;

    const { followers, details } = useUserStore();
    const { removeLike, updatingLikeId, addLike } = useFeedStore();

    const carouselRef = useRef(null);
    const progress = useSharedValue(0);
    const postDetails = item.postDetails || item;
    const authorDetails = item.postAuthorDetails || details;
    const images = postDetails.mediaUrls;
    const screenWidth = Dimensions.get("window").width;

    const [showComments, setShowComments] = useState(false);
    const { setActiveCommentPostId } = useActivityStore();

    const [isLoading, setIsLoading] = useState(true);

    const { advancedSettings, onAdvancedSettingsChange } = useAdvancedSettings({
        defaultSettings: {
            autoPlay: false,
            autoPlayInterval: 2000,
            autoPlayReverse: false,
            data: images,
            height: 258,
            loop: true,
            pagingEnabled: true,
            snapEnabled: true,
            vertical: false,
            width: screenWidth - 32,
        },
    });

    const handleCarouselLayout = () => {
        setIsLoading(false);
    };

    const handleLikePost = useCallback(() => {
        const func = postDetails.isLiked ? removeLike : addLike;
        func(details.id, postDetails.id);
    }, [postDetails.isLiked, details.id, postDetails.id, removeLike, addLike]);

    return (
        <View className="py-6 px-4 border-b-[2px] border-[#1F2023]">
            <View className="flex flex-row items-center mr-2 mb-4">
                <Image
                    width={40}
                    height={40}
                    source={{ uri: authorDetails.profilePictureUrl }}
                    className="rounded-full mr-2"
                />
                <View className="flex flex-col gap-1 mr-auto">
                    <View className="flex flex-row items-center">
                        <Text className="font-manrope-bold text-14 text-white leading-none h-[14px]">
                            {authorDetails.name}
                        </Text>
                        <VerifiedIcon />
                        <View className="mx-2 h-1 w-1 rounded-full bg-[#b1b1b1]" />
                        {!followers.includes(authorDetails.id) ? (
                            <Text className="text-primary-main font-manrope-bold text-14 leading-none h-[14px]">
                                Follow
                            </Text>
                        ) : null}
                    </View>
                    <View className="flex flex-row items-center">
                        <Text className="font-manrope text-10 text-[#26F037]">
                            Portfolio - ₹8.6L
                        </Text>
                        <View className="mx-2 h-1 w-1 mt-1 rounded-full bg-[#b1b1b1]" />
                        <Text className="text-[#b1b1b1] font-manrope-medium text-10">
                            {moment(postDetails.createdAt).format("h:mm a")}
                        </Text>
                    </View>
                </View>
                <ThreeDotsIcon />
            </View>
            {postDetails.content && (
                <Text className="font-manrope text-white text-14">
                    {postDetails.content}
                </Text>
            )}

            {images?.length ? (
                <View className="w-full mt-4 relative">
                    <Carousel
                        ref={carouselRef}
                        autoPlayInterval={2000}
                        data={images}
                        height={220}
                        loop={images.length > 1}
                        pagingEnabled={true}
                        snapEnabled={true}
                        width={screenWidth - 32}
                        style={{
                            width: screenWidth - 32,
                            opacity: isLoading ? 0 : 1,
                        }}
                        onProgressChange={progress}
                        onLayout={handleCarouselLayout} // Set loading to false when the carousel layout is ready
                        renderItem={({ item, index }) => (
                            <SlideItem
                                key={index}
                                index={index}
                                rounded={true}
                                source={item}
                                progress={parseInt(progress.value.toFixed(0))}
                                onImageLoad={() => setIsLoading(false)}
                            />
                        )}
                    />
                    {isLoading && (
                        <View
                            className="bg-[#b1b1b1] animate-pulse absolute w-full h-full"
                            style={{
                                borderRadius: 15,
                                height: 220,
                                width: screenWidth - 32,
                            }}
                        ></View>
                    )}
                    {images?.length > 1 && (
                        <Pagination.Basic
                            progress={progress}
                            length={images.length}
                            data={images}
                            containerStyle={{
                                position: "relative",
                                alignSelf: "center",
                                marginBottom: 10,
                                marginTop: 16,
                            }}
                            dotStyle={{
                                width: 25,
                                height: 4,
                                backgroundColor: "#b1b1b1",
                                marginHorizontal: 4,
                            }}
                            activeDotStyle={{
                                width: 25,
                                height: 4,
                                backgroundColor: "#b4ef02",
                            }}
                        />
                    )}
                </View>
            ) : null}
            <View className="flex flex-row items-center mt-3 gap-4">
                {updatingLikeId === postDetails.id && !!updatingLikeId ? (
                    <ActivityIndicator size="small" color="#b4ef02" />
                ) : (
                    <View className="flex flex-row items-center">
                        <TouchableOpacity onPress={handleLikePost}>
                            <ThumbIcon
                                color={postDetails.isLiked ? "#b4ef02" : "#fff"}
                                fill={postDetails.isLiked ? true : false}
                            />
                        </TouchableOpacity>
                        <Text className="font-manrope-medium text-12 text-white ml-1">
                            {postDetails.likesCount}
                        </Text>
                    </View>
                )}
                <TouchableOpacity
                    className="flex flex-row items-center mr-auto"
                    onPress={() => setActiveCommentPostId(postDetails.id)}
                >
                    <MessageIcon />
                    <Text className="font-manrope-medium text-12 text-white ml-1 mr-auto">
                        {postDetails.commentsCount}
                    </Text>
                </TouchableOpacity>
                <SendIcon />
                <BookmarkIcon />
            </View>
        </View>
    );
});

export default FeedPost;
