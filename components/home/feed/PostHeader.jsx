import React, { memo } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import VerifiedIcon from "@/icons/VerifiedIcon";
import ThreeDotsIcon from "@/icons/ThreeDotsIcon";
import moment from "moment";
import { formatNumber } from "@/utils/formatNumber";

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
        followers,
        details,
        setProfileBottomSheet,
        activeProfileUserId,
    }) => {
        return (
            <View className="flex flex-row items-center mr-2 mb-4">
                <Image
                    width={40}
                    height={40}
                    source={{ uri: authorDetails.userAvatarUrl }}
                    className="rounded-full mr-2"
                />
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
                                {authorDetails.name}
                            </Text>
                        </TouchableOpacity>
                        {authorDetails.isVerifiedUser ? (
                            <VerifiedIcon className="ml-1" />
                        ) : null}
                        {!followers.includes(authorDetails.id) &&
                        authorDetails.id !== userId ? (
                            <>
                                <View className="mx-2 h-3 w-3 flex items-center justify-center">
                                    <View className="h-1 w-1 rounded-full bg-[#b1b1b1]" />
                                </View>
                                <Text className="text-primary-main font-manrope-bold text-14">
                                    Follow
                                </Text>
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
