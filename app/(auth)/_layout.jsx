import CommentsBottomSheet from "@/components/home/CommentsBottomSheet";
import FollowBottomSheet from "@/components/profile/FollowBottomSheet";
import UserProfileBottomSheet from "@/components/profile/UserProfileBottomSheet";
import useUserStore from "@/hooks/useUserStore";
import AddIcon from "@/icons/AddIcon";
import HomeIcon from "@/icons/HomeIcon";
import PersonIcon from "@/icons/PersonIcon";
import SearchIcon from "@/icons/SearchIcon";
import TrophyIcon from "@/icons/TrophyIcon";
import network from "@/network";
import API_PATHS from "@/network/apis";
import { HEADERS_KEYS } from "@/network/constants";
import replacePlaceholders from "@/utils/replacePlaceholders";
import { router, Tabs } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
    const { setUserDetails, setFollowing, setFollowers, details } =
        useUserStore();

    useEffect(() => {
        handleAuthentication();
    }, []);

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

    return (
        <SafeAreaProvider>
            <View className="flex-1 bg-[#161616]">
                <Tabs
                    screenOptions={{
                        tabBarStyle: {
                            backgroundColor: "#161616",
                            borderTopWidth: 2,
                            borderTopColor: "#1F2023",
                            paddingHorizontal: 8, // Matches px-2 (8px)
                            paddingTop: 8, // 8px top padding
                            paddingBottom: Platform.OS === "ios" ? 8 : 8, // Safe area bottom for iOS
                        },
                        tabBarActiveTintColor: "#b4ef02",
                        tabBarInactiveTintColor: "#ffffff",
                        headerShown: false,
                        tabBarHideOnKeyboard: true,
                        lazy: true,
                    }}
                    tabBar={({ state, descriptors, navigation }) => (
                        <View
                            style={{
                                backgroundColor: "#161616",
                                borderTopWidth: 2,
                                borderTopColor: "#1F2023",
                                paddingBottom: Platform.OS === "ios" ? 16 : 0,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    height: 60,
                                    paddingHorizontal: 8,
                                    paddingTop: 10,
                                    paddingBottom: 8,
                                }}
                            >
                                {state.routes.map((route, index) => {
                                    const { options } = descriptors[route.key];
                                    const isFocused = state.index === index;

                                    const onPress = () => {
                                        const event = navigation.emit({
                                            type: "tabPress",
                                            target: route.key,
                                            canPreventDefault: true,
                                        });

                                        if (
                                            !isFocused &&
                                            !event.defaultPrevented
                                        ) {
                                            navigation.navigate(route.name);
                                        }
                                    };

                                    return (
                                        <TouchableOpacity
                                            key={route.key}
                                            accessibilityRole="button"
                                            accessibilityState={{
                                                selected: isFocused,
                                            }}
                                            onPress={onPress}
                                            style={{
                                                flex: 1,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                // Constrain touchable area to a 40x40 square around the icon
                                                width: 40,
                                                height: 40,
                                            }}
                                            // Android ripple effect
                                            {...(Platform.OS === "android" &&
                                                {
                                                    // rippleColor: "#b4ef02",
                                                    // android_ripple: {
                                                    //     borderless: false,
                                                    //     radius: 20, // Smaller ripple radius
                                                    // },
                                                })}
                                        >
                                            {options.tabBarIcon({
                                                color: isFocused
                                                    ? "#b4ef02"
                                                    : "#ffffff",
                                            })}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    )}
                >
                    <Tabs.Screen
                        name="home"
                        options={{
                            tabBarIcon: ({ color }) => (
                                <HomeIcon color={color} size={28} />
                            ),
                            tabBarLabel: "",
                        }}
                    />
                    <Tabs.Screen
                        name="search"
                        options={{
                            tabBarIcon: ({ color }) => (
                                <SearchIcon color={color} size={26} />
                            ),
                            tabBarLabel: "",
                        }}
                    />
                    <Tabs.Screen
                        name="create"
                        options={{
                            tabBarIcon: ({ color }) => (
                                <AddIcon color={color} size={26} />
                            ),
                            tabBarLabel: "",
                        }}
                    />
                    <Tabs.Screen
                        name="notifications"
                        options={{
                            tabBarIcon: ({ color }) => (
                                <TrophyIcon color={color} size={26} />
                            ),
                            tabBarLabel: "",
                        }}
                    />
                    <Tabs.Screen
                        name="profile"
                        options={{
                            tabBarIcon: ({ color }) => (
                                <PersonIcon color={color} size={26} />
                            ),
                            tabBarLabel: "",
                        }}
                    />
                </Tabs>
                <CommentsBottomSheet userId={details.id} />
                <UserProfileBottomSheet />
                <FollowBottomSheet />
            </View>
        </SafeAreaProvider>
    );
}
