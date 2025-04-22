import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import network from "@/network";
import API_PATHS from "@/network/apis";
import generateQueryParams from "@/utils/generateQueryParams";
import VerifiedIcon from "@/icons/VerifiedIcon";
import clsx from "clsx";
import useUserStore from "@/hooks/useUserStore";
import { ActivityIndicator } from "react-native-paper";
import UserItem from "./UserItem";

function UserList({ query }) {
    const timerRef = useRef();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { following, details } = useUserStore();

    useEffect(() => {
        // Clear the previous timer if it exists
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // Set a new timer
        if (query) {
            setLoading(true);
            timerRef.current = setTimeout(() => {
                network
                    .get(
                        generateQueryParams(API_PATHS.getUsersByParams, {
                            query,
                        })
                    )
                    .then((res) => {
                        console.log(res);
                        setUsers(res);
                        setLoading(false);
                    })
                    .catch(() => {
                        setLoading(false);
                    });
            }, 300); // Adjust the debounce delay as needed (300ms in this case)
        } else {
            setUsers([]);
            setLoading(false);
        }

        // Cleanup function to clear the timer on component unmount or when query changes
        return () => {
            clearTimeout(timerRef.current);
        };
    }, [query]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size={24} />
            </View>
        );
    }

    if (!users.length) {
        return (
            <View className="flex-1 flex-col justify-center items-center">
                <Text className="text-[#B1B1B1] font-manrope-bold text-16 mb-1">
                    No Results
                </Text>
                <Text className="text-white font-manrope text-14">
                    We couldn’t find anyone matching your search
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 py-6">
            <FlatList
                data={users.filter((user) => user.id !== details.id)}
                renderItem={({ item }) => (
                    <UserItem
                        item={item}
                        following={following}
                        details={details}
                    />
                )}
                keyExtractor={(item) => "user-list-key-" + item.id}
            />
        </View>
    );
}

export default UserList;
