import ImageUploader from "@/components/ImageUploader";
import MultiSelectSearch from "@/components/MultiSelectSearch";
import useGetUsers from "@/hooks/useGetUsers";
import CloseIcon from "@/icons/CloseIcon";
import ImageIcon from "@/icons/ImageIcon";
import PersonIcon from "@/icons/PersonIcon";
import network from "@/network";
import API_PATHS from "@/network/apis";
import { HEADERS_KEYS } from "@/network/constants";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
    Platform,
    SafeAreaView,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";

const Create = () => {
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [text, setText] = useState("");
    const [tags, setTags] = useState([]);
    const [images, setImages] = useState([]);

    const {
        searchText,
        users,
        loading: userListLoading,
        setSearchText,
    } = useGetUsers();

    function handleSubmit() {
        const userId = SecureStore.getItem(HEADERS_KEYS.USER_ID);
        if (!text && !images.length) return null;

        setLoading(true);
        network
            .post(API_PATHS.createPost, {
                userId,
                content: text,
                mediaUrls: images.map((img) => img.publicUrl),
                taggedUserIdList: tags.map((tag) => tag.id),
            })
            .then((res) => {
                // Clear all form data after successful post creation
                setText("");
                setTags([]);
                setImages([]);
                setSearchText("");
                setLoading(false);
                router.replace("/(auth)/home");
            })
            .catch((err) => {
                setLoading(false);
                ToastAndroid.showWithGravityAndOffset(
                    err.message,
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    25,
                    50
                );
            });
    }

    return (
        <SafeAreaView
            className="flex-1 bg-[#161616]"
            edges={["top", "left", "right"]}
        >
            <View className="flex-1 px-4 py-6 gap-2">
                {/* Header */}
                <View className="flex flex-row items-center h-12">
                    <TouchableOpacity
                        className="items-center justify-center w-10 h-10"
                        onPress={() => router.replace("/(auth)/home")}
                    >
                        <CloseIcon />
                    </TouchableOpacity>
                    <Text className="font-manrope-bold text-18 text-white">
                        Create New Post
                    </Text>
                    <View className="ml-auto">
                        {loading ? (
                            <ActivityIndicator size={20} color="#B4EF02" />
                        ) : (
                            <Button
                                mode="contained"
                                onPress={handleSubmit}
                                buttonColor="#B4EF02"
                                textColor="#000"
                                labelStyle={{
                                    fontFamily: "Manrope-Bold",
                                    fontSize: 14,
                                }}
                                style={{ borderRadius: 20 }}
                            >
                                Post Now
                            </Button>
                        )}
                    </View>
                </View>

                {/* Text Input Section */}
                <View className="flex flex-row mb-2">
                    <View
                        className="h-6 bg-primary-main w-[2px] mr-3"
                        style={{
                            marginTop: Platform.OS === "ios" ? 30 : 4,
                        }}
                    />
                    <TextInput
                        mode="flat"
                        placeholder="Post your views, data or charts..."
                        placeholderTextColor="#b1b1b1"
                        textColor="#fff"
                        underlineStyle={{ display: "none" }}
                        multiline={true}
                        numberOfLines={8}
                        style={{
                            flex: 1,
                            backgroundColor: "transparent",
                            borderBottomWidth: 0,
                            color: "#fff",
                            fontFamily: "Manrope",
                            fontSize: 16,
                            lineHeight: 24,
                            paddingVertical: Platform.OS === "ios" ? 4 : 2,
                            paddingHorizontal: 0,
                            minHeight: 120,
                        }}
                        value={text}
                        onChangeText={setText}
                    />
                </View>

                {/* Image Upload Section */}
                <View className="mb-2">
                    <ImageUploader images={images} setImages={setImages}>
                        <View className="flex flex-row items-center gap-3 py-3">
                            <ImageIcon />
                            <Text className="font-manrope text-14 text-[#b1b1b1]">
                                Add up to 4 Images
                            </Text>
                        </View>
                    </ImageUploader>
                </View>

                {/* User Tags Section */}
                <View className="mb-4">
                    <MultiSelectSearch
                        loading={userListLoading}
                        data={users}
                        selectedItems={tags}
                        setSelectedItems={setTags}
                        searchText={searchText}
                        setSearchText={setSearchText}
                        placeholder="Use @ to mention a user"
                    >
                        <View className="flex flex-row items-center gap-3 py-3">
                            <PersonIcon color="#b1b1b1" size={18} />
                            <View className="flex-1">
                                {tags.length > 0 ? (
                                    <View className="flex flex-row flex-wrap gap-2">
                                        {tags.map((tag, index) => (
                                            <Text
                                                key={tag.id}
                                                className="font-manrope text-12 text-white bg-[#2a2a2a] px-3 py-1 rounded-full"
                                            >
                                                @{tag.nickname}
                                            </Text>
                                        ))}
                                    </View>
                                ) : (
                                    <Text className="font-manrope text-14 text-white opacity-70">
                                        Use @ to mention a user
                                    </Text>
                                )}
                            </View>
                        </View>
                    </MultiSelectSearch>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Create;
