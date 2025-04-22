import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import { Slot, useRouter, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import network from "@/network";
import * as SecureStore from "expo-secure-store";

// Import your icons
import HomeIcon from "@/icons/HomeIcon";
import SearchIcon from "@/icons/SearchIcon";
import AddIcon from "@/icons/AddIcon";
import BellIcon from "@/icons/BellIcon";
import PersonIcon from "@/icons/PersonIcon";
import API_PATHS from "@/network/apis";
import generateQueryParams from "@/utils/generateQueryParams";
import { HEADERS_KEYS } from "@/network/constants";
import replacePlaceholders from "@/utils/replacePlaceholders";
import useUserStore from "@/hooks/useUserStore";
import CommentsBottomSheet from "@/components/home/CommentsBottomSheet";

const CustomBottomNavigation = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState("home");
    const [animation] = useState(new Animated.Value(1));

    const { setUserDetails, setFollowing, setFollowers, fetchPosts, details } =
        useUserStore();

    useEffect(() => {
        handleAuthentication();
    }, []);

    useEffect(() => {
        const routeName = pathname.split("/")[1];

        if (
            routeName &&
            ["home", "search", "create", "notifications", "profile"].includes(
                routeName
            )
        ) {
            setActiveTab(routeName);
        }
    }, [pathname]);

    async function handleAuthentication() {
        const userId = await SecureStore.getItemAsync(HEADERS_KEYS.USER_ID);
        const token = await SecureStore.getItemAsync(HEADERS_KEYS.TOKEN);
        const refreshToken = await SecureStore.getItemAsync(
            HEADERS_KEYS.REFRESH_TOKEN
        );

        network
            .get(replacePlaceholders(API_PATHS.getUserById, userId))
            .then((res) => {
                setUserDetails(res);
            })
            .catch(async () => {
                router.replace("/redirect?refresh=true");
            });

        network
            .get(replacePlaceholders(API_PATHS.getFollowing, userId))
            .then((res) => {
                setFollowing(res);
            });

        network
            .get(replacePlaceholders(API_PATHS.getFollowers, userId))
            .then((res) => {
                setFollowers(res);
            });
    }

    const handleTabPress = (tabName) => {
        // Start the fade-out animation
        Animated.timing(animation, {
            toValue: 0, // Fade out
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            // Change the active tab and route after fade-out
            setActiveTab(tabName);
            router.replace(`/(auth)/${tabName}`);
            // Fade in after changing the tab
            Animated.timing(animation, {
                toValue: 1, // Fade in
                duration: 200,
                useNativeDriver: true,
            }).start();
        });
    };

    return (
        <SafeAreaProvider>
            <View className="flex-1 bg-[#161616]">
                {/* Render the active screen with animation */}
                <Animated.View
                    style={{
                        opacity: animation, // Bind opacity to the animated value
                    }}
                    className="flex-1"
                >
                    <Slot />
                </Animated.View>

                {/* Bottom Navigation */}
                <View className="flex-row justify-around items-center h-20 bg-[#161616] border-t-2 border-[#1F2023] px-2">
                    <TouchableOpacity
                        className="items-center justify-center flex-1 py-2"
                        onPress={() => handleTabPress("home")}
                    >
                        <HomeIcon
                            color={activeTab === "home" ? "#b4ef02" : "#ffffff"}
                            size={28}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="items-center justify-center flex-1 py-2"
                        onPress={() => handleTabPress("search")}
                    >
                        <SearchIcon
                            color={
                                activeTab === "search" ? "#b4ef02" : "#ffffff"
                            }
                            size={26}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="items-center justify-center flex-1 py-2"
                        onPress={() => handleTabPress("create")}
                    >
                        <AddIcon
                            color={
                                activeTab === "create" ? "#b4ef02" : "#ffffff"
                            }
                            size={26}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="items-center justify-center flex-1 py-2"
                        onPress={() => handleTabPress("notifications")}
                    >
                        <BellIcon
                            color={
                                activeTab === "notifications"
                                    ? "#b4ef02"
                                    : "#ffffff"
                            }
                            size={26}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="items-center justify-center flex-1 py-2"
                        onPress={() => handleTabPress("profile")}
                    >
                        <PersonIcon
                            color={
                                activeTab === "profile" ? "#b4ef02" : "#ffffff"
                            }
                            size={26}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <CommentsBottomSheet userId={details.id} />
        </SafeAreaProvider>
    );
};

export default CustomBottomNavigation;
