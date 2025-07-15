import React, { memo, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import VerifiedIcon from "@/icons/VerifiedIcon";
import ThreeDotsIcon from "@/icons/ThreeDotsIcon";
import moment from "moment";
import { formatNumber } from "@/utils/formatNumber";
import { ActivityIndicator } from "react-native-paper";
import useUserStore from "@/hooks/useUserStore";
import network from "@/network";
import API_PATHS from "@/network/apis";

/**
 * Renders the post header with user details, follow button, portfolio, and timestamp.
 * @param {Object} props
 * @param {Object} props.authorDetails - User details { id, name, profilePictureUrl }
 * @param {Object} props.postDetails - Post details { createdAt }
 * @param {string} props.userId - Current user ID
 * @param {string[]} props.followers - Array of followed user IDs
 * @param {Object} props.details - Current user details { id }
 * @param {Function} props.setProfileBottomSheet - Function to open user profile
 * @param {string|null} props.activeProfileUserId - Currently open profile ID
 */
const PostHeader = memo(
    ({
        authorDetails,
        postDetails,
        userId,
        following,
        details,
        setProfileBottomSheet,
        activeProfileUserId,
    }) => {
        const [loading, setLoading] = useState(false);
        const { addFollower } = useUserStore();

        const handleFollow = () => {
            if (loading) return;

            setLoading(true);
            network
                .post(API_PATHS.follow, {
                    followerId: details.id,
                    followeeId: authorDetails.id,
                })
                .then(() => {
                    addFollower(authorDetails.id).then(() => {
                        setLoading(false);
                    });
                })
                .catch(() => {
                    setLoading(false);
                });
        };

        console.log(authorDetails);

        return (
            <View className="flex flex-row items-center mr-2 mb-4">
                {authorDetails.userAvatarUrl ? (
                    <Image
                        source={{ uri: authorDetails.userAvatarUrl }}
                        width={40}
                        height={40}
                        className="rounded-full mr-3"
                    />
                ) : (
                    <View className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center mr-3">
                        <Text className="font-manrope-bold text-16 text-white">
                            {(authorDetails.nickname || "U")[0].toUpperCase()}
                        </Text>
                    </View>
                )}
                <View className="flex-1 flex-col gap-1">
                    <View className="flex flex-row items-center">
                        <TouchableOpacity
                            onPress={() =>
                                authorDetails.id !== details.id &&
                                activeProfileUserId !== authorDetails.id &&
                                setProfileBottomSheet(authorDetails.id)
                            }
                        >
                            <Text className="font-manrope-bold text-14 text-white h-[25px]">
                                {authorDetails?.userName || "Unknown User"}
                            </Text>
                        </TouchableOpacity>
                        {authorDetails.isVerifiedUser ? (
                            <VerifiedIcon className="ml-1" />
                        ) : null}
                        {!following.includes(authorDetails.id) &&
                        authorDetails.id != userId ? (
                            <>
                                <View className="mx-2 h-3 w-3 flex items-center justify-center">
                                    <View className="h-1 w-1 rounded-full bg-[#b1b1b1]" />
                                </View>
                                <TouchableOpacity
                                    onPress={handleFollow}
                                    disabled={loading}
                                    activeOpacity={0.7}
                                >
                                    {loading ? (
                                        <ActivityIndicator size={14} />
                                    ) : (
                                        <Text className="text-primary-main font-manrope-bold text-14">
                                            Follow
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </>
                        ) : null}
                    </View>
                    <View className="flex flex-row items-center">
                        {authorDetails.userPortfolioValue ? (
                            <View className="flex flex-row items-center">
                                <Text className="font-manrope text-10 text-[#26F037]">
                                    Portfolio -{" "}
                                    {formatNumber(
                                        authorDetails.userPortfolioValue
                                    )}
                                </Text>
                                <View className="mx-2 h-3 w-3 flex items-center justify-center">
                                    <View className="h-1 w-1 rounded-full bg-[#b1b1b1]" />
                                </View>
                            </View>
                        ) : null}
                        <Text className="text-[#b1b1b1] font-manrope-medium text-10">
                            {moment(postDetails.createdAt).format(
                                "ddd, DD MMM, h:mm A"
                            )}
                        </Text>
                    </View>
                </View>
                <ThreeDotsIcon />
            </View>
        );
    }
);

export default PostHeader;
