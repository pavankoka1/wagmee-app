import { View, Text, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useState } from "react";
import CloseIcon from "@/icons/CloseIcon";
import { router } from "expo-router";
import { ActivityIndicator, Button } from "react-native-paper";
import { TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import ImageIcon from "@/icons/ImageIcon";
import ImageUploader from "@/components/ImageUploader";
import MultiSelectSearch from "@/components/MultiSelectSearch";
import PersonIcon from "@/icons/PersonIcon";
import useGetUsers from "@/hooks/useGetUsers";
import clsx from "clsx";
import * as SecureStore from "expo-secure-store";
import { HEADERS_KEYS } from "@/network/constants";
import network from "@/network";
import API_PATHS from "@/network/apis";

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
        <View className="flex-1 px-4 bg-[#161616] py-5 gap-4">
            <View className="flex flex-row items-center h-10">
                <TouchableOpacity
                    className="items-center justify-center"
                    onPress={() => router.replace("/(auth)/home")}
                >
                    <CloseIcon />
                </TouchableOpacity>
                <Text className="font-manrope-bold text-16 text-white tracking-wide ml-6 leading-[20px] mr-auto text-center">
                    Create New post
                </Text>

                {loading ? (
                    <ActivityIndicator size={16} className="ml-auto mr-10" />
                ) : (
                    <Button className="ml-auto mr-3" onPress={handleSubmit}>
                        Post Now
                    </Button>
                )}
            </View>
            <View className="flex flex-row ml-[2px] mb-6">
                <View className="h-6 bg-primary-main w-[2px] mt-4" />
                <TextInput
                    mode="flat"
                    placeholder="Post your views, data or charts..."
                    placeholderTextColor="#b1b1b1"
                    textColor="#fff"
                    fontSize={20}
                    underlineStyle={
                        {
                            // display: "none",
                        }
                    }
                    multiline={true}
                    numberOfLines={8}
                    height={160}
                    style={{
                        flex: 1,
                        backgroundColor: "transparent",
                        borderBottomWidth: 0,
                        border: "none",
                        color: "#fff",
                        fontFamily: "Manrope",
                        fontSize: 14,
                    }}
                    value={text}
                    onChangeText={setText} // Use onChangeText for TextInput
                />
            </View>
            <ImageUploader images={images} setImages={setImages}>
                <View className="flex flex-row items-center gap-2">
                    <ImageIcon />
                    <Text className="font-manrope text-12 text-[#b1b1b1] leading-1">
                        Add up to 4 Images
                    </Text>
                </View>
            </ImageUploader>
            <MultiSelectSearch
                loading={userListLoading}
                data={users}
                selectedItems={tags}
                setSelectedItems={setTags}
                searchText={searchText}
                setSearchText={setSearchText}
                placeholder="Use @ to mention a user"
            >
                <View className="flex flex-row items-center gap-2">
                    <PersonIcon color="#b1b1b1" size={18} />
                    <Text
                        className={clsx("font-manrope text-12 leading-1", {
                            "text-[#b1b1b1]": !tags.length,
                            "text-white": !!tags.length,
                        })}
                    >
                        {tags.length
                            ? tags.map((tag) => "@" + tag.nickname).join(", ")
                            : "Use @ to mention a user"}
                    </Text>
                </View>
            </MultiSelectSearch>
        </View>
    );
};

export default Create;
