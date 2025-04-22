import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import useUserStore from "@/hooks/useUserStore";
import { Button } from "react-native-paper";

const Card = () => {
    const { details, followers, following, setSettingsBottomSheet } =
        useUserStore();

    const url = details?.userAvatarUrl
        ? details?.userAvatarUrl
        : details?.profilePictureUrl;

    return (
        <View className="py-2 px-4 gap-4">
            <View className="flex flex-row gap-6 items-center">
                <Image
                    source={{ uri: url }}
                    width={80}
                    height={80}
                    className="rounded-full"
                />
                <View className="flex flex-col gap-2 h-fit flex-1">
                    <Text className="font-manrope-bold text-18 text-white leading-[24px]">
                        {details?.userName}
                    </Text>
                    <View className="flex flex-row gap-16">
                        <View className="flex flex-col gap-1 items-center h-fit w-fit">
                            <Text className="font-manrope-bold text-primary-main">
                                {details.postCount}
                            </Text>
                            <Text className="font-manrope-medium text-12 text-white leading-1">
                                Posts
                            </Text>
                        </View>
                        <View className="flex flex-col gap-1 items-center h-fit w-fit">
                            <Text className="font-manrope-bold text-primary-main">
                                {details.followingCount}
                            </Text>
                            <Text className="font-manrope-medium text-12 text-white leading-1">
                                Following
                            </Text>
                        </View>
                        <View className="flex flex-col gap-1 items-center h-fit w-fit">
                            <Text className="font-manrope-bold text-primary-main">
                                {details.followersCount}
                            </Text>
                            <Text className="font-manrope-medium text-12 text-white leading-1">
                                Followers
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            {details?.userBio && (
                <Text className="font-manrope text-white text-14 tracking-wide mb-1">
                    {details.userBio}
                </Text>
            )}
            <TouchableOpacity
                className="w-full bg-[#1f1f1f] py-3 flex justify-center items-center rounded-xl"
                onPress={() => setSettingsBottomSheet(true)}
            >
                <Text className="font-manrope-bold text-14 leading-[18px] text-white">
                    Edit Profile
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default Card;
