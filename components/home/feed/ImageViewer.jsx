import React, { memo } from "react";
import { View, Image, TouchableOpacity, Dimensions } from "react-native";
import { Portal } from "react-native-paper";
import CloseIcon from "@/icons/CloseIcon";

/**
 * Renders a full-screen image viewer in a portal.
 * @param {Object} props
 * @param {string|null} props.imageUrl - URL of the image to display
 * @param {Function} props.onClose - Callback to close the viewer
 */
const ImageViewer = memo(({ imageUrl, onClose }) => {
    if (!imageUrl) return null;

    return (
        <Portal>
            <View
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
                    className="absolute top-4 right-4 z-10"
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
            </View>
        </Portal>
    );
});

export default ImageViewer;
