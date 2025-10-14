import useBottomSheetStore from "@/hooks/useBottomSheetStore";
import useFeedStore from "@/hooks/useFeedStore";
import useUserStore from "@/hooks/useUserStore";
import CloseIcon from "@/icons/CloseIcon";
import ThreeDotsIcon from "@/icons/ThreeDotsIcon";
import network from "@/network";
import API_PATHS from "@/network/apis";
import { HEADERS_KEYS } from "@/network/constants";
import replacePlaceholders from "@/utils/replacePlaceholders";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Portal } from "react-native-paper";
import Card from "./Card";
import UserOptionsBottomSheet from "./UserOptionsBottomSheet";
import UserProfilePortfolio from "./UserProfilePortfolio";
import UserProfilePosts from "./UserProfilePosts";

const UserProfileBottomSheet = () => {
    const { activeProfileUserId, setProfileBottomSheet, details } =
        useUserStore();
    const { isFollowSheetOpen } = useBottomSheetStore();
    const {
        userProfilePostIds,
        userProfileOffsets,
        hasMoreProfilePosts,
        fetchUserProfilePosts,
        isFetchingUserProfilePosts,
        error,
    } = useFeedStore();
    const currentUserId = SecureStore.getItem(HEADERS_KEYS.USER_ID);

    const isOpen = !!activeProfileUserId && !isFollowSheetOpen;
    const postIds = userProfilePostIds[activeProfileUserId] || [];

    // State for user details
    const [userDetails, setUserDetails] = useState(null);
    const [isFetchingUser, setIsFetchingUser] = useState(false);
    const [activeTab, setActiveTab] = useState("portfolio");
    const [showUserOptions, setShowUserOptions] = useState(false);

    // Reset all states when bottom sheet is closed
    useEffect(() => {
        if (!isOpen) {
            setUserDetails(null);
            setIsFetchingUser(false);
            setActiveTab("portfolio");
        }
    }, [isOpen]);

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

    const renderContent = () => {
        switch (activeTab) {
            case "posts":
                return (
                    <UserProfilePosts
                        postIds={postIds}
                        isFetchingUserProfilePosts={isFetchingUserProfilePosts}
                        handleLoadMore={handleLoadMore}
                        error={error}
                    />
                );
            case "portfolio":
                return <UserProfilePortfolio userId={activeProfileUserId} />;
            default:
                return null;
        }
    };

    if (!isOpen) return null;

    return (
        <Portal>
            <SafeAreaView className="flex-1 bg-[#161616]">
                <View className="flex-1 pt-2 pb-8 flex flex-col">
                    {/* Close Button and Options */}
                    <View className="flex-row items-center justify-between px-2">
                        <View className="w-12" />
                        <View className="flex-row items-center">
                            <TouchableOpacity
                                onPress={() => setShowUserOptions(true)}
                                hitSlop={{
                                    top: 8,
                                    bottom: 8,
                                    left: 8,
                                    right: 8,
                                }}
                            >
                                <View className="p-4">
                                    <ThreeDotsIcon />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setProfileBottomSheet(null);
                                }}
                                hitSlop={{
                                    top: 8,
                                    bottom: 8,
                                    left: 8,
                                    right: 8,
                                }}
                            >
                                <View className="p-4">
                                    <CloseIcon />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* User Details Card */}
                    <Card userId={activeProfileUserId} />

                    {/* Custom Tabs */}
                    <View className="flex-1 mt-4">
                        {/* Tab Headers */}
                        <View className="flex-row px-4 mb-4 border-b border-[#1F2023]">
                            <TouchableOpacity
                                className={`flex-1 py-4 ${
                                    activeTab === "portfolio"
                                        ? "border-b-2 border-[#b4ef02]"
                                        : "border-b border-[#333333]"
                                }`}
                                onPress={() => setActiveTab("portfolio")}
                            >
                                <Text
                                    className={`font-manrope-bold tracking-wide text-center ${
                                        activeTab === "portfolio"
                                            ? "text-[#b4ef02]"
                                            : "text-[#666666]"
                                    }`}
                                >
                                    Portfolio
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className={`flex-1 py-4 ${
                                    activeTab === "posts"
                                        ? "border-b-2 border-[#b4ef02]"
                                        : "border-b border-[#333333]"
                                }`}
                                onPress={() => setActiveTab("posts")}
                            >
                                <Text
                                    className={`font-manrope-bold tracking-wide text-center ${
                                        activeTab === "posts"
                                            ? "text-[#b4ef02]"
                                            : "text-[#666666]"
                                    }`}
                                >
                                    Posts
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Tab Content */}
                        <View className="flex-1">{renderContent()}</View>
                    </View>
                </View>

                {/* User Options Bottom Sheet */}
                {userDetails && (
                    <UserOptionsBottomSheet
                        isOpen={showUserOptions}
                        onClose={() => setShowUserOptions(false)}
                        userDetails={userDetails}
                        currentUserId={details.id}
                        onBlockUser={(blockedUserId) => {
                            setProfileBottomSheet(null);
                            console.log("User blocked:", blockedUserId);
                        }}
                    />
                )}
            </SafeAreaView>
        </Portal>
    );
};

export default UserProfileBottomSheet;
