import {
    View,
    Text,
    TouchableNativeFeedback,
    Image,
    KeyboardAvoidingView,
    TouchableOpacity,
    Keyboard,
    Platform,
} from "react-native";
import React, { useState } from "react";
import { ActivityIndicator, Button } from "react-native-paper";
import VerifiedIcon from "@/icons/VerifiedIcon";
import clsx from "clsx";
import replacePlaceholders from "@/utils/replacePlaceholders";
import useUserStore from "@/hooks/useUserStore";
import network from "@/network";
import API_PATHS from "@/network/apis";

function UserItem({ item }) {
    const { following, details, removeFollower, addFollower } = useUserStore();
    const [loading, setLoading] = useState(false);

    function handleClick() {
        setLoading(true);
        if (following.includes(item.id)) {
            network
                .delete(
                    replacePlaceholders(API_PATHS.unfollow, details.id, item.id)
                )
                .then(() => {
                    removeFollower(item.id).then(() => {
                        setLoading(false);
                    });
                })
                .catch(() => {
                    setLoading(false);
                });
        } else {
            network
                .post(API_PATHS.follow, {
                    followerId: details.id,
                    followeeId: item.id,
                })
                .then(() => {
                    addFollower(item.id).then(() => {
                        setLoading(false);
                    });
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }

    const isFollowing = following.includes(item.id);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View className="border-b border-[#1F2023] py-2 flex flex-row items-center">
                <Image
                    source={{ uri: item.profilePictureUrl }}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                />
                <View className="flex flex-col">
                    <View className="flex flex-row gap-1 items-center mb-[2px]">
                        <Text className="font-manrope-bold text-12 text-white">
                            {item.nickname}
                        </Text>
                        <VerifiedIcon />
                    </View>
                    <Text className="text-[#26F037] font-manrope-medium text-10">
                        Portfolio - ₹8.6L
                    </Text>
                </View>
                {loading ? (
                    <ActivityIndicator size={16} className="ml-auto mr-6" />
                ) : (
                    <TouchableOpacity
                        onPress={handleClick}
                        activeOpacity={0.7}
                        className="ml-auto"
                    >
                        <Text
                            className={clsx(
                                "ml-auto font-manrope-bold text-10 py-2 px-4 rounded-xl",
                                {
                                    "bg-primary-main text-[#292929]":
                                        !isFollowing,
                                    "text-primary-main border border-primary-main":
                                        isFollowing,
                                }
                            )}
                        >
                            {isFollowing ? "Following" : "Follow"}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

export default UserItem;
