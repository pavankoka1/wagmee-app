import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import network from "@/network";
import API_PATHS from "@/network/apis";
import generateQueryParams from "@/utils/generateQueryParams";
import VerifiedIcon from "@/icons/VerifiedIcon";
import clsx from "clsx";
import useUserStore from "@/hooks/useUserStore";
import { ActivityIndicator, IconButton } from "react-native-paper";
import UserItem from "./UserItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
            <View className="flex-1 flex-col justify-center items-center px-8">
                {query ? (
                    <>
                        <MaterialCommunityIcons
                            name="account-search"
                            size={64}
                            color="#B1B1B1"
                        />
                        <Text className="text-[#B1B1B1] font-manrope-bold text-18 mb-2 mt-4 text-center">
                            No Results Found
                        </Text>
                        <Text className="text-white font-manrope text-14 text-center">
                            We couldn't find any users matching "{query}"
                        </Text>
                        <Text className="text-[#B1B1B1] font-manrope text-12 text-center mt-2">
                            Try searching with a different name or username
                        </Text>
                    </>
                ) : (
                    <>
                        <MaterialCommunityIcons
                            name="account-group"
                            size={64}
                            color="#B1B1B1"
                        />
                        <Text className="text-[#B1B1B1] font-manrope-bold text-18 mb-2 mt-4 text-center">
                            Discover People
                        </Text>
                        <Text className="text-white font-manrope text-14 text-center">
                            Search for friends, influencers, or creators
                        </Text>
                        <Text className="text-[#B1B1B1] font-manrope text-12 text-center mt-2">
                            Try searching by name, username, or interests
                        </Text>
                    </>
                )}
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
