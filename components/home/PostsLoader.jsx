import React from "react";
import VerifiedIcon from "@/icons/VerifiedIcon";
import { View, Text } from "react-native";
import ThreeDotsIcon from "@/icons/ThreeDotsIcon";
import ThumbIcon from "@/icons/ThumbIcon";
import MessageIcon from "@/icons/MessageIcon";
import SendIcon from "@/icons/SendIcon";
import BookmarkIcon from "@/icons/BookmarkIcon";

function PostsLoader() {
    return (
        <View className="px-4 py-6 border-b border-[2px] border-[#1F2023]">
            <View className="flex flex-row items-center">
                <View className="h-10 w-10 animate-pulse bg-[#b1b1b1] rounded-full" />
                <View className="mr-auto">
                    <View className="flex flex-row ml-2 items-center mb-1">
                        <View className="w-24 h-4 animate-pulse bg-[#b1b1b1] rounded mr-1" />
                        <VerifiedIcon />
                        <View className="mx-2 h-1 w-1 mt-1 rounded-full bg-[#b1b1b1]" />
                        <View className="w-12 h-4 animate-pulse bg-[#b1b1b1] rounded mr-1" />
                    </View>
                    <View className="flex flex-row ml-2 items-center">
                        <View className="w-20 h-4 animate-pulse bg-[#b1b1b1] rounded mr-1" />
                        <View className="mx-2 h-1 w-1 mt-1 rounded-full bg-[#b1b1b1]" />
                        <View className="w-12 h-4 animate-pulse bg-[#b1b1b1] rounded" />
                    </View>
                </View>
                <ThreeDotsIcon />
            </View>
            <View className="w-3/4 h-8 rounded-lg animate-pulse bg-[#b1b1b1] mt-6" />
            <View className="w-full h-60 rounded-2xl animate-pulse bg-[#b1b1b1] mt-4" />
            <View className="flex flex-row items-center justify-center mt-4 gap-2">
                <View className="h-1 w-7 rounded-lg animate-pulse bg-[#b1b1b1]" />
                <View className="h-1 w-7 rounded-lg animate-pulse bg-[#b1b1b1]" />
                <View className="h-1 w-7 rounded-lg animate-pulse bg-[#b1b1b1]" />
                <View className="h-1 w-7 rounded-lg animate-pulse bg-[#b1b1b1]" />
            </View>
            <View className="flex flex-row items-center mt-6 gap-4">
                <View className="flex flex-row items-center">
                    <ThumbIcon />
                    <View className="ml-1 w-4 h-4 animate-pulse bg-[#b1b1b1] rounded" />
                </View>
                <View className="flex flex-row items-center mr-auto">
                    <MessageIcon />
                    <View className="ml-1 w-4 h-4 animate-pulse bg-[#b1b1b1] rounded" />
                </View>
                <SendIcon />
                <BookmarkIcon />
            </View>
        </View>
    );
}

export default PostsLoader;
