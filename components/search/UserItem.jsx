import { View, Text, Image, TouchableOpacity, Keyboard } from "react-native";
import React, { useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import VerifiedIcon from "@/icons/VerifiedIcon";
import clsx from "clsx";
import replacePlaceholders from "@/utils/replacePlaceholders";
import useUserStore from "@/hooks/useUserStore";
import network from "@/network";
import API_PATHS from "@/network/apis";

function UserItem({ item }) {
    const {
        following,
        details,
        removeFollower,
        addFollower,
        setProfileBottomSheet,
    } = useUserStore();
    const [loading, setLoading] = useState(false);

    function handleClick() {
        Keyboard.dismiss();
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

    const handleNameClick = () => {
        Keyboard.dismiss();
        setProfileBottomSheet(item.id);
    };

    const isFollowing = following.includes(item.id);

    return (
        <View className="border-b border-[#1F2023] py-4 flex flex-row items-center">
            {/* <Image
                source={{ uri: item.profilePictureUrl }}
                width={40}
                height={40}
                className="rounded-full mr-3"
            /> */}
            <View className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center mr-3">
                <Text className="font-manrope-bold text-16 text-white">
                    {(item.nickname || "U")[0].toUpperCase()}
                </Text>
            </View>
            <View className="flex flex-col">
                <TouchableOpacity
                    onPress={handleNameClick}
                    activeOpacity={0.7}
                    className="flex flex-row items-center mb-[2px]"
                >
                    <Text className="font-manrope-bold text-14 text-white">
                        {item.nickname}
                    </Text>
                    {item.isVerifiedUser && (
                        <View className="mt-1 ml-[2px]">
                            <VerifiedIcon />
                        </View>
                    )}
                </TouchableOpacity>
                {/* <Text className="text-[#26F037] font-manrope-medium text-10">
                    Portfolio - ₹8.6L
                </Text> */}
            </View>
            <TouchableOpacity
                onPress={handleClick}
                activeOpacity={0.7}
                className="ml-auto"
                disabled={loading}
            >
                <Text
                    className={clsx(
                        "ml-auto font-manrope-bold text-12 py-3 px-5 rounded-xl w-28 text-center flex-row items-center justify-center",
                        {
                            "bg-primary-main text-[#292929]": !isFollowing,
                            "text-[#ef4444] border border-[#ef4444] font-manrope-medium":
                                isFollowing,
                            "opacity-70": loading,
                        }
                    )}
                >
                    {loading ? (
                        <ActivityIndicator
                            size={16}
                            color={isFollowing ? "#ef4444" : "#292929"}
                        />
                    ) : isFollowing ? (
                        "Unfollow"
                    ) : (
                        "Follow"
                    )}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default UserItem;
