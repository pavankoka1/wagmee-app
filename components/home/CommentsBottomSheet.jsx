import {
    View,
    Text,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { Portal, ActivityIndicator } from "react-native-paper";
import useActivityStore from "@/hooks/useActivityStore";
import network from "@/network";
import API_PATHS from "@/network/apis";
import replacePlaceholders from "@/utils/replacePlaceholders";
import moment from "moment";
import useUserStore from "@/hooks/useUserStore";
import CommentInput from "./CommentInput"; // Import the new component
import CloseIcon from "@/icons/CloseIcon";

const CommentsBottomSheet = ({ userId }) => {
    const [isFetchingComments, setIsFetchingComments] = useState(false);
    const [isPostingComment, setisPostingComment] = useState(false);
    const [comment, setComment] = useState("");

    const {
        comments: allComments,
        activeCommentPostId,
        setCommentsById,
        setActiveCommentPostId,
    } = useActivityStore();
    const { details } = useUserStore();

    const isOpen = !!activeCommentPostId;
    const comments = allComments[activeCommentPostId];

    useEffect(() => {
        if (isOpen && !comments && activeCommentPostId) {
            setIsFetchingComments(true);
            network
                .get(
                    replacePlaceholders(
                        API_PATHS.getCommentsByPostId,
                        activeCommentPostId
                    )
                )
                .then((res) => {
                    setCommentsById(activeCommentPostId, res);
                })
                .finally(() => {
                    setIsFetchingComments(false);
                });
        }
    }, [isOpen, comments]);

    const renderComment = ({ item }) => (
        <View className="px-4 py-6 flex flex-row gap-4 border-b border-[#b1b1b1]">
            <Image
                width={40}
                height={40}
                source={{ uri: item.userDetails.profilePictureUrl }}
                className="rounded-full mr-2"
            />
            <View className="flex-1 flex flex-col gap-2">
                <Text className="text-white font-manrope text-12">
                    {item.content}
                </Text>
                <Text className="text-[#B1B1B1] text-10 font-manrope">
                    {moment(item.updatedAt).fromNow()}
                </Text>
            </View>
        </View>
    );

    if (!isOpen) return null;

    return (
        <Portal>
            {/* <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            > */}
            <View className="w-screen h-screen bg-[#161616] pt-2 pb-8 px-4">
                <View className="absolute right-0 top-0 z-10">
                    <TouchableOpacity
                        onPress={() => {
                            setActiveCommentPostId(null);
                        }}
                    >
                        <View className="p-4">
                            <CloseIcon />
                        </View>
                    </TouchableOpacity>
                </View>

                <Text className="text-white text-2xl font-bold mb-4">
                    Comments
                </Text>
                <View className="flex-1">
                    {isFetchingComments || !comments ? (
                        <View className="flex justify-center items-center flex-1">
                            <ActivityIndicator size="small" />
                        </View>
                    ) : comments.length ? (
                        <FlatList
                            data={comments}
                            renderItem={renderComment}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={{
                                paddingBottom: 20,
                                flexGrow: 1,
                            }}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        <Text className="text-[#B1B1B1] text-12 font-manrope my-auto text-center">
                            No comments yet!
                        </Text>
                    )}
                </View>
                <CommentInput userId={userId} />
            </View>
            {/* </KeyboardAvoidingView> */}
        </Portal>
    );
};

export default CommentsBottomSheet;
