import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Animated,
    Easing,
    FlatList,
    ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Portal } from "react-native-paper";
import useUserStore from "@/hooks/useUserStore";
import useFeedStore from "@/hooks/useFeedStore";
import Card from "./Card";
import CloseIcon from "@/icons/CloseIcon";
import FeedPost from "@/components/home/FeedPost";
import PostsLoader from "@/components/home/PostsLoader";
import network from "@/network";
import API_PATHS from "@/network/apis";
import replacePlaceholders from "@/utils/replacePlaceholders";
import * as SecureStore from "expo-secure-store";
import { HEADERS_KEYS } from "@/network/constants";

const UserProfileBottomSheet = () => {
    const { activeProfileUserId, setProfileBottomSheet, details } =
        useUserStore();
    const {
        userProfilePostIds,
        userProfileOffsets,
        hasMoreProfilePosts,
        fetchUserProfilePosts,
        isFetchingUserProfilePosts,
        error,
    } = useFeedStore();
    const slideAnim = useRef(new Animated.Value(1000)).current;
    const currentUserId = SecureStore.getItem(HEADERS_KEYS.USER_ID);

    const isOpen = !!activeProfileUserId;
    const postIds = userProfilePostIds[activeProfileUserId] || [];

    // State for user details
    const [userDetails, setUserDetails] = useState(null);
    const [isFetchingUser, setIsFetchingUser] = useState(false);

    // Fetch user details
    useEffect(() => {
        if (isOpen && activeProfileUserId) {
            if (activeProfileUserId === currentUserId) {
                setUserDetails(details);
            } else {
                setIsFetchingUser(true);
                network
                    .get(
                        replacePlaceholders(
                            API_PATHS.getUserById,
                            activeProfileUserId
                        )
                    )
                    .then((res) => {
                        setUserDetails(res);
                    })
                    .finally(() => {
                        setIsFetchingUser(false);
                    });
            }
        } else {
            setUserDetails(null);
        }
    }, [activeProfileUserId, isOpen, currentUserId, details]);

    // Fetch initial posts when userDetails is available
    useEffect(() => {
        if (isOpen && activeProfileUserId && userDetails) {
            fetchUserProfilePosts(activeProfileUserId, userDetails, 10, 0);
        }
    }, [activeProfileUserId, isOpen, userDetails, fetchUserProfilePosts]);

    // Handle pagination
    const handleLoadMore = () => {
        if (
            !isFetchingUserProfilePosts &&
            hasMoreProfilePosts[activeProfileUserId] &&
            userDetails
        ) {
            const offset =
                parseInt(userProfileOffsets[activeProfileUserId] / 10) || 0;
            fetchUserProfilePosts(activeProfileUserId, userDetails, 10, offset);
        }
    };

    // Slide animation
    useEffect(() => {
        if (isOpen) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 1000,
                duration: 300,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }).start();
        }
    }, [isOpen, slideAnim]);

    if (!isOpen) return null;

    // Render FeedPost or PostsLoader
    const renderItem = ({ item }) =>
        item ? <FeedPost id={item} /> : <PostsLoader />;

    // Append shimmer placeholders during fetch
    const data = isFetchingUserProfilePosts
        ? [...postIds, ...Array(4).fill(null)]
        : postIds;

    return (
        <Portal>
            <SafeAreaView className="flex-1 bg-[#161616]">
                <Animated.View
                    className="flex-1 pt-2 pb-8 flex flex-col"
                    style={{
                        transform: [{ translateY: slideAnim }],
                    }}
                >
                    {/* Close Button */}
                    <View className="ml-auto">
                        <TouchableOpacity
                            onPress={() => {
                                setProfileBottomSheet(null);
                            }}
                        >
                            <View className="p-4">
                                <CloseIcon />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* User Details Card */}
                    <Card userId={activeProfileUserId} />

                    {/* Posts Section */}
                    <View className="flex-1 mt-4">
                        {isFetchingUser ? (
                            <View className="flex-1 justify-center items-center">
                                <ActivityIndicator
                                    size="small"
                                    color="#b4ef02"
                                />
                            </View>
                        ) : error ? (
                            <View className="flex-1 justify-center items-center">
                                <Text className="text-[#B1B1B1] font-manrope text-14">
                                    Failed to fetch posts
                                </Text>
                            </View>
                        ) : postIds.length || isFetchingUserProfilePosts ? (
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
                        ) : (
                            <View className="flex-1 justify-center items-center">
                                <Text className="text-[#B1B1B1] font-manrope-bold text-16 mb-1">
                                    No posts yet!
                                </Text>
                                <Text className="text-white font-manrope text-14">
                                    This user hasn't posted anything.
                                </Text>
                            </View>
                        )}
                    </View>
                </Animated.View>
            </SafeAreaView>
        </Portal>
    );
};

export default UserProfileBottomSheet;
