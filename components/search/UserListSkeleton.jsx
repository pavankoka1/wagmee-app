import React from "react";
import { View } from "react-native";

function UserListSkeleton({ count = 8 }) {
    return (
        <View style={{ flex: 1 }}>
            {[...Array(count)].map((_, idx) => (
                <View
                    key={idx}
                    className="border-b border-[#1F2023] py-4 flex flex-row items-center px-4"
                >
                    <View className="w-10 h-10 rounded-full bg-gray-700 mr-3 animate-pulse" />
                    <View className="flex flex-col flex-1 gap-2">
                        <View className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                        <View className="h-3 w-16 bg-gray-700 rounded animate-pulse" />
                    </View>
                    <View className="ml-auto h-11 w-28 bg-gray-700 rounded-xl animate-pulse" />
                </View>
            ))}
        </View>
    );
}

export default UserListSkeleton;
