import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import useUserStore from "@/hooks/useUserStore";
import { Button } from "react-native-paper";
import network from "@/network";
import API_PATHS from "@/network/apis";
import replacePlaceholders from "@/utils/replacePlaceholders";

const Card = ({ userId }) => {
    const { details: currentUserDetails, setSettingsBottomSheet } =
        useUserStore();
    const [userDetails, setUserDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userId) {
            // Fetch user details for another user
            setIsLoading(true);
            network
                .get(replacePlaceholders(API_PATHS.getUserById, userId))
                .then((res) => {
                    setUserDetails(res);
                    setIsLoading(false);
                })
                .catch((err) => {
                    setError("Failed to fetch user details");
                    setIsLoading(false);
                });
        } else {
            // Use current user details from store
            setUserDetails(currentUserDetails);
        }
    }, [userId, currentUserDetails]);

    // Determine which details to render
    const renderDetails = userDetails || {};

    const url = renderDetails?.userAvatarUrl
        ? renderDetails?.userAvatarUrl
        : renderDetails?.profilePictureUrl;

    // Shimmer effect for loading state
    if (isLoading) {
        return (
            <View className="py-2 px-4 gap-4 w-screen bg-[#161616]">
                {/* Avatar and username row */}
                <View className="flex flex-row gap-6 items-center">
                    <View
                        key="avatar-skeleton"
                        className="w-20 h-20 rounded-full bg-gray-700"
                        style={{ animation: "none" }}
                    />
                    <View className="flex flex-col gap-4 flex-1">
                        <View
                            key="username-skeleton"
                            className="h-6 w-3/4 bg-gray-700 rounded"
                            style={{ animation: "none" }}
                        />
                        {/* Stats */}
                        <View className="flex flex-row gap-16">
                            {[1, 2, 3].map((index) => (
                                <View
                                    key={`stat-${index}`}
                                    className="flex flex-col gap-2 items-center"
                                >
                                    <View
                                        className="h-5 w-6 bg-gray-700 rounded"
                                        style={{ animation: "none" }}
                                    />
                                    <View
                                        className="h-4 w-12 bg-gray-700 rounded"
                                        style={{ animation: "none" }}
                                    />
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
                {/* Bio */}
                <View
                    key="bio-skeleton"
                    className="h-10 w-full bg-gray-700 rounded mb-1"
                    style={{ animation: "none" }}
                />
            </View>
        );
    }

    // Error state
    if (error) {
        return (
            <View className="py-2 px-4 w-screen bg-[#161616] flex items-center justify-center">
                <Text className="font-manrope text-white text-14">{error}</Text>
            </View>
        );
    }

    // Render user details
    return (
        <View className="py-2 px-4 gap-4 w-screen bg-[#161616]">
            <View className="flex flex-row gap-6 items-center">
                <Image
                    source={{ uri: url || currentUserDetails.userAvatarUrl }}
                    width={80}
                    height={80}
                    className="rounded-full"
                />
                {/* <View className="w-20 h-20 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                    <Text className="font-manrope-bold text-32 text-white">
                        {(renderDetails?.name || "U")[0].toUpperCase()}
                    </Text>
                </View> */}
                <View className="flex flex-col gap-2 h-fit flex-1">
                    <Text className="font-manrope-bold text-18 text-white leading-[24px]">
                        {renderDetails?.userName || "Unknown User"}
                    </Text>
                    <View className="flex flex-row gap-16">
                        <View className="flex flex-col gap-1 items-center h-fit w-fit">
                            <Text className="font-manrope-bold text-primary-main">
                                {renderDetails?.postCount || 0}
                            </Text>
                            <Text className="font-manrope-medium text-12 text-white leading-1">
                                Posts
                            </Text>
                        </View>
                        <View className="flex flex-col gap-1 items-center h-fit w-fit">
                            <Text className="font-manrope-bold text-primary-main">
                                {renderDetails?.followingCount || 0}
                            </Text>
                            <Text className="font-manrope-medium text-12 text-white leading-1">
                                Following
                            </Text>
                        </View>
                        <View className="flex flex-col gap-1 items-center h-fit w-fit">
                            <Text className="font-manrope-bold text-primary-main">
                                {renderDetails?.followersCount || 0}
                            </Text>
                            <Text className="font-manrope-medium text-12 text-white leading-1">
                                Followers
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            {renderDetails?.userBio && (
                <Text className="font-manrope text-white text-14 tracking-wide mb-1">
                    {renderDetails.userBio}
                </Text>
            )}
            {!userId && (
                <TouchableOpacity
                    className="w-full bg-[#1f1f1f] py-3 flex justify-center items-center rounded-xl"
                    onPress={() => setSettingsBottomSheet(true)}
                >
                    <Text className="font-manrope-bold text-14 leading-[18px] text-white">
                        {userId ? "View Profile" : "Edit Profile"}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Card;
