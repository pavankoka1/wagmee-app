// CommentInput.js
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { TextInput, ActivityIndicator } from "react-native-paper";
import SendIcon from "@/icons/SendIcon";
import useActivityStore from "@/hooks/useActivityStore";
import clsx from "clsx";

const CommentInput = React.memo(({ userId }) => {
    const [text, setText] = useState("");

    const { addComment, isPostingComment } = useActivityStore();
    return (
        <View className="border h-32 px-4 py-1 border-white flex-row items-center gap-4 rounded-xl">
            <TextInput
                mode="flat"
                className="flex-1 text-white"
                placeholder="Add your comment ..."
                placeholderTextColor="#b1b1b1"
                textColor="#fff"
                fontSize={20}
                multiline={true}
                numberOfLines={4}
                underlineStyle={{ display: "none" }}
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
                onChangeText={setText}
                cursorColor="#B4EF02"
            />
            {isPostingComment ? (
                <ActivityIndicator size="small" className="mr-2" />
            ) : (
                <TouchableOpacity
                    disabled={!text.trim()}
                    onPress={() =>
                        addComment({ comment: text, userId }).then(() =>
                            setText("")
                        )
                    }
                    className={clsx("p-2", {
                        "opacity-30": !text.trim(),
                    })}
                >
                    <SendIcon />
                </TouchableOpacity>
            )}
        </View>
    );
});

export default CommentInput;
