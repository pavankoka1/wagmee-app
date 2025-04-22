import React, { useMemo, useEffect, useState, useRef } from "react";
import {
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    View,
    Text,
} from "react-native";
import Animated from "react-native-reanimated";
import { Image } from "expo-image"; // Importing from expo-image

export const SlideItem = (props) => {
    const {
        style,
        index = 0,
        rounded = true,
        testID,
        progress,
        onImageLoad,
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
        index === 0 && onImageLoad();
        setImageLoaded(true);
        setIsLoading(false); // Set loading to false immediately on load
    };

    const handleImageError = () => {
        setIsLoading(false); // Set loading to false on error
    };

    if (!imageLoaded && progress !== index)
        return (
            <View
                className="bg-transparent"
                style={{
                    height: 220,
                    width: Dimensions.get("window").width - 32,
                }} // Use Dimensions.get('window').width
            >
                <View className="w-full h-full bg-[#b1b1b1] animate-pulse rounded-3xl"></View>
            </View>
        );

    return (
        <Animated.View
            testID={testID}
            style={{ flex: 1 }}
            {...animatedViewProps}
            className="relative"
        >
            {isLoading ? (
                <View className="absolute top-0 left-0 w-full h-full bg-transparent">
                    <View className="w-full h-full bg-[#b1b1b1] animate-pulse rounded-3xl"></View>
                </View>
            ) : null}
            <Animated.Image
                style={[
                    style,
                    rounded && { borderRadius: 15 },
                    { opacity: isLoading || !imageLoaded ? 0 : 1 }, // Fade out image while loading
                ]}
                className="w-full h-full"
                source={{ uri: source }} // Use the same source format
                contentFit="cover" // Use contentFit instead of resizeMode
                onLoad={handleImageLoad} // Trigger when image loads
                onError={handleImageError} // Trigger when image fails to load
            />
        </Animated.View>
    );
};

export default SlideItem;
