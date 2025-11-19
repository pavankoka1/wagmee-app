import CloseIcon from "@/icons/CloseIcon";
import React, { memo } from "react";
import { Dimensions, Image, Platform, TouchableOpacity } from "react-native";
import { Portal } from "react-native-paper";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
/**
 * Renders a full-screen image viewer in a portal.
 * @param {Object} props
 * @param {string|null} props.imageUrl - URL of the image to display
 * @param {Function} props.onClose - Callback to close the viewer
 */
const ImageViewer = memo(({ imageUrl, onClose }) => {
    const insets = useSafeAreaInsets();

    if (!imageUrl) return null;

    return (
        <Portal>
            <SafeAreaView
                className="flex-1 bg-black bg-opacity-90 justify-center items-center"
                style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                }}
            >
                <TouchableOpacity
                    className="absolute right-4 z-10"
                    style={{
                        top: Platform.OS === "ios" ? insets.top + 16 : 16,
                    }}
                    onPress={onClose}
                >
                    <CloseIcon fill="#fff" />
                </TouchableOpacity>
                <Image
                    source={{ uri: imageUrl }}
                    style={{
                        width: Dimensions.get("window").width,
                        height: Dimensions.get("window").height * 0.8,
                        resizeMode: "contain",
                    }}
                />
            </SafeAreaView>
        </Portal>
    );
});

export default ImageViewer;
