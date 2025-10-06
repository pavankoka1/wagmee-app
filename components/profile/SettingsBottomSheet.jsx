import BottomSheet from "@/components/BottomSheet";
import useUserStore from "@/hooks/useUserStore";
import ArrowIcon from "@/icons/ArrowIcon";
import network from "@/network";
import API_PATHS from "@/network/apis";
import clearAppStorage from "@/utils/clearAppStorage";
import generateQueryParams from "@/utils/generateQueryParams";
import replacePlaceholders from "@/utils/replacePlaceholders";
import Feather from "@expo/vector-icons/Feather";
import clsx from "clsx";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    Linking,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import RNRestart from "react-native-restart";
import ImageUploader from "../ImageUploader";

function SettingsBottomSheet({ isOpen, onClose }) {
    const router = useRouter();
    const { details, setUserDetails, setSettingsBottomSheet } = useUserStore();

    const [isUpdatingDetails, setIsUpdatingDetails] = useState(false);
    const [images, setImages] = useState([]);
    const [userName, setUserName] = useState(null);
    const [bio, setBio] = useState(null);

    const url = details?.userAvatarUrl
        ? details?.userAvatarUrl
        : details?.profilePictureUrl;

    useEffect(() => {
        setImages([
            {
                publicUrl: url,
                uploading: false,
                uri: url,
            },
        ]);
        setUserName(details?.userName);
        setBio(details?.userBio);
    }, [details]);

    function handleDetailsUpdate() {
        setIsUpdatingDetails(true);
        network
            .put(replacePlaceholders(API_PATHS.updateUserDetails, details.id), {
                userAvatarUrl: activeImage?.publicUrl,
                userName,
                userBio: bio,
            })
            .then((res) => {
                setUserDetails({ ...details, ...res });
                setSettingsBottomSheet(false);
            })
            .finally(() => {
                setIsUpdatingDetails(false);
            });
    }

    const handleUserNameChange = (text) => {
        setUserName(text);
        // const regex =
        //     /^(?!.*\.\.)(?!.*\.$)(?!.*\._)(?!.*_\.)[a-zA-Z0-9._]{1,60}$/;

        // // Allow editing of the existing username
        // if (!text || regex.test(text) || text === details.nickname) {
        //     setUserName(text);
        // } else {
        //     ToastAndroid.showWithGravityAndOffset(
        //         "Please enter a valid username",
        //         ToastAndroid.LONG,
        //         ToastAndroid.TOP,
        //         25,
        //         50
        //     );
        // }
    };

    const handleSignOut = async () => {
        try {
            console.log("🚪 Starting sign out process...");

            // Close the settings sheet first
            await onClose();

            // Clear all app storage and tokens first to ensure clean state
            console.log("🧹 Clearing app storage...");
            await clearAppStorage();

            // Construct the logout URL with proper parameters
            const logoutUrl = generateQueryParams(
                "https://dev-ejfqnjn20ph3kzag.us.auth0.com/v2/logout",
                {
                    client_id: process.env.EXPO_PUBLIC_CLERK_AUTH0_CLIENT_ID,
                    returnTo: "tradetribe://redirect?logout=true",
                    // Add parameters to ensure complete logout
                    federated: "true", // Logout from all federated connections
                    logout_hint: "prompt=login", // Force re-authentication on next login
                }
            );

            console.log("🌐 Opening logout URL:", logoutUrl);
            // Open the browser for logout with options to ensure redirect back to app
            try {
                await WebBrowser.openBrowserAsync(logoutUrl, {
                    showTitle: false,
                    enableBarCollapsing: false,
                    showInRecents: false,
                });
                console.log("🔙 Returned from logout URL");
            } catch (error) {
                console.log("❌ WebBrowser failed, trying Linking:", error);
                // Fallback to Linking if WebBrowser fails
                await Linking.openURL(logoutUrl);
            }

            // Navigate to login screen
            console.log("🔄 Navigating to login screen...");
            router.replace("/");
        } catch (error) {
            console.error("❌ Sign out error:", error);
            // Ensure we still clear storage even if there's an error
            await clearAppStorage();
            router.replace("/");

            ToastAndroid.showWithGravityAndOffset(
                "Could not sign out completely.",
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                25,
                50
            );
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Call API to delete account
                            await network.delete(
                                replacePlaceholders(
                                    API_PATHS.deleteUser,
                                    details.id
                                )
                            );
                            // Clear all app storage and tokens
                            await clearAppStorage();
                            // Restart the app to ensure clean state
                            RNRestart.Restart();
                        } catch (error) {
                            ToastAndroid.showWithGravityAndOffset(
                                "Error deleting account",
                                ToastAndroid.LONG,
                                ToastAndroid.TOP,
                                25,
                                50
                            );
                        }
                    },
                },
            ]
        );
    };

    const activeImage = images[images.length - 1];
    const disableSaveButton =
        !userName ||
        !activeImage ||
        !activeImage?.publicUrl ||
        activeImage?.uploading;

    if (!isOpen) return null;

    if (!Object.keys(details) || !activeImage || !activeImage.uri) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="small" />
            </View>
        );
    }

    return (
        <BottomSheet
            className="flex-1"
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={onClose}
            paddingNeeded={false}
        >
            <SafeAreaView
                className="flex-1"
                style={{
                    paddingTop: Platform.OS === "ios" ? 0 : 20,
                    paddingBottom: Platform.OS === "ios" ? 0 : 20,
                }}
            >
                <View className="flex-1 px-4 pt-5">
                    <View className="flex flex-row items-center mb-5">
                        <Button
                            onPress={() => {
                                setSettingsBottomSheet(false);
                            }}
                            className="m-0 p-0"
                            style={{ minWidth: 0 }}
                        >
                            <ArrowIcon />
                        </Button>
                        <Text className="ml-2 font-manrope-bold text-14 text-white leading-[20px] flex-1">
                            Edit Profile
                        </Text>
                        {/* <TouchableOpacity
                            onPress={() => {
                                setSettingsBottomSheet(false);
                            }}
                            className="p-2"
                        >
                            <CloseIcon />
                        </TouchableOpacity> */}
                    </View>
                    <ScrollView
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: Platform.OS === "ios" ? 40 : 20,
                        }}
                    >
                        <View className="flex flex-col justify-center items-center">
                            <View
                                className="relative rounded-full mt-4 mb-8"
                                height={120}
                                width={120}
                            >
                                <Image
                                    className="rounded-full"
                                    source={{
                                        uri: activeImage.uri,
                                    }}
                                    height={120}
                                    width={120}
                                />
                                {!activeImage.uploading && (
                                    <ImageUploader
                                        selectionLimit={1}
                                        setImages={setImages}
                                    >
                                        <View className="absolute bottom-0 right-0 h-8 w-8 bg-[#B4EF02] border-[2px] border-[#161616] rounded-full -translate-x-1/4 -translate-y-1/4 flex justify-center items-center">
                                            <Feather
                                                name="edit-2"
                                                size={12}
                                                color="#161616"
                                            />
                                        </View>
                                    </ImageUploader>
                                )}
                                {activeImage.uploading && (
                                    <View
                                        className="absolute bg-[#161616] opacity-75 rounded-full left-0 top-0 flex justify-center items-center"
                                        height={120}
                                        width={120}
                                    >
                                        <ActivityIndicator size="small" />
                                    </View>
                                )}
                            </View>
                            <Text className="font-manrope-bold text-12 text-white leading-[20px] mb-2 w-full">
                                Username
                            </Text>
                            <TextInput
                                className="w-full text-white bg-[#1F1F1F] rounded-xl p-4 mb-8"
                                placeholder="Enter your username"
                                placeholderTextColor="#B1B1B1"
                                value={userName}
                                onChangeText={handleUserNameChange}
                                cursorColor="#B4EF02"
                            />
                            <Text className="font-manrope-bold text-12 text-white leading-[20px] mb-2 w-full">
                                Bio
                            </Text>
                            <TextInput
                                className="w-full text-white bg-[#1F1F1F] rounded-xl p-4 mb-8"
                                placeholder="Enter your Bio"
                                placeholderTextColor="#B1B1B1"
                                cursorColor="#B4EF02"
                                value={bio}
                                onChangeText={setBio}
                                multiline={true}
                                numberOfLines={5}
                                height={120}
                                textAlignVertical="top"
                            />
                            <Text className="font-manrope-bold text-12 text-white leading-[20px] mb-2 w-full opacity-75">
                                Email ID
                            </Text>
                            <TextInput
                                editable={false}
                                className="w-full text-white bg-[#1F1F1F] rounded-xl p-4 mb-8 opacity-75"
                                placeholder="Enter your Bio"
                                value={details.email}
                                placeholderTextColor="#B1B1B1"
                                cursorColor="#B4EF02"
                            />

                            <TouchableOpacity
                                disabled={disableSaveButton}
                                className={clsx([
                                    "w-full bg-primary-main h-12 rounded-2xl flex justify-center items-center mt-8",
                                    {
                                        "opacity-50": disableSaveButton,
                                    },
                                ])}
                                onPress={handleDetailsUpdate}
                            >
                                {isUpdatingDetails ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#161616"
                                    />
                                ) : (
                                    <Text
                                        className={clsx([
                                            "font-manrope-bold text-14 text-[#292929] leading-[20px]",
                                        ])}
                                    >
                                        Save
                                    </Text>
                                )}
                            </TouchableOpacity>

                            {/* Sign Out and Delete Account Buttons */}
                            <View className="w-full mt-10 space-y-4 gap-4">
                                <TouchableOpacity
                                    onPress={handleSignOut}
                                    className="w-full bg-[#1F1F1F] h-12 rounded-2xl flex justify-center items-center"
                                >
                                    <Text className="font-manrope-bold text-14 text-white leading-[20px]">
                                        Sign Out
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleDeleteAccount}
                                    className="w-full border-[0.5px] border-[#ef4444] h-12 rounded-2xl flex justify-center items-center"
                                >
                                    <Text className="font-manrope-medium text-14 text-[#ef4444] leading-[20px]">
                                        Delete Account
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </BottomSheet>
    );
}

export default SettingsBottomSheet;
