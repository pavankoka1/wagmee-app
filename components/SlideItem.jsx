import React, { useMemo, useEffect, useState, useRef } from "react";
import {
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    View,
    Text,
    Pressable,
} from "react-native";
import Animated from "react-native-reanimated";
import { Image } from "expo-image";

export const SlideItem = (props) => {
    const {
        style,
        index = 0,
        rounded = true,
        testID,
        progress,
        onImageLoad,
        onImageClick,
        ...animatedViewProps
    } = props;

    const source = useMemo(() => props.source, [index, props.source]);
    const [isLoading, setIsLoading] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setTimeout(() => {
            imageLoaded && setIsLoading(false);
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }, 0);

        return () => clearTimeout(timerRef.current);
    }, [imageLoaded, progress]);

    const handleImageLoad = () => {
        index === 0 && onImageLoad?.();
        setImageLoaded(true);
        setIsLoading(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
    };

    const handleImageClick = () => {
        onImageClick?.(index);
    };

    if (!imageLoaded && progress !== index)
        return (
            <View
                className="bg-transparent"
                style={{
                    height: 220,
                    width: Dimensions.get("window").width - 32,
                }}
            >
                <View className="w-full h-full bg-gray-700 animate-pulse rounded-3xl"></View>
            </View>
        );

    return (
        <Animated.View
            testID={testID}
            style={[{ flex: 1 }, style]}
            {...animatedViewProps}
            className="relative"
        >
            {!isLoading ? (
                <View className="absolute top-0 left-0 w-full h-full bg-transparent">
                    <View className="w-full h-full bg-gray-700 animate-pulse rounded-3xl"></View>
                </View>
            ) : null}
            <Pressable
                onPress={handleImageClick}
                style={({ pressed }) => [
                    {
                        opacity: pressed ? 0.9 : 1,
                        width: "100%",
                        height: "100%",
                    },
                ]}
            >
                <Animated.Image
                    style={[
                        rounded && { borderRadius: 15 },
                        { opacity: isLoading || !imageLoaded ? 0 : 1 },
                    ]}
                    className="w-full h-full"
                    source={{ uri: source }}
                    contentFit="cover"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />
            </Pressable>
        </Animated.View>
    );
};

export default SlideItem;
