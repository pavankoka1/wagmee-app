import UserListSkeleton from "@/components/search/UserListSkeleton";
import useUserSearchStore from "@/hooks/useUserSearchStore";
import useUserStore from "@/hooks/useUserStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Text, View } from "react-native";
import UserItem from "./UserItem";

function UserList({ query }) {
    const { following, details } = useUserStore();
    const { userMap, loadingMap, errorMap, fetchUsers } = useUserSearchStore();
    const debounceRef = useRef();
    const lastNonEmptyRef = useRef({ users: [], query: "" });
    const [debouncing, setDebouncing] = useState(false);

    useEffect(() => {
        setDebouncing(true);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setDebouncing(false);
            fetchUsers(query || "");
        }, 300);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, fetchUsers]);

    const users = userMap[query || ""] || [];
    const loading = loadingMap[query || ""];
    const error = errorMap[query || ""];

    // Track last non-empty users and query
    useEffect(() => {
        if (users.length > 0) {
            lastNonEmptyRef.current = { users, query };
        }
    }, [users, query]);

    // 1. While typing (debouncing): show skeleton
    if (debouncing) {
        return <UserListSkeleton />;
    }

    // 2. After debounce, while fetching: show only skeleton
    if (loading) {
        return <UserListSkeleton />;
    }

    // 3. After fetch: show results or zero state
    if (error) {
        return (
            <View className="flex-1 justify-center items-center px-8">
                <MaterialCommunityIcons
                    name="alert-circle-outline"
                    size={64}
                    color="#B1B1B1"
                />
                <Text className="text-[#B1B1B1] font-manrope-bold text-18 mb-2 mt-4 text-center">
                    Error
                </Text>
                <Text className="text-white font-manrope text-14 text-center">
                    {error}
                </Text>
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

    // Limit display to 5 users when showing initial top traders (empty query)
    const displayUsers = users.filter((user) => user.id !== details.id);
    const limitedUsers = displayUsers;

    return (
        <View className="flex-1 py-6">
            {/* Show "Top Traders" label when displaying initial results */}
            {!query && users.length > 0 && (
                <Text className="text-white/90 font-manrope-bold text-16 mb-4 px-4">
                    Top Traders
                </Text>
            )}
            <FlatList
                data={limitedUsers}
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
