import React from "react";
import { View, Dimensions, Pressable } from "react-native";
import { Image } from "expo-image";
import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolate,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const SlideItem = React.memo(
    ({ source, index, progress, onImageClick }) => {
        const handlePress = React.useCallback(() => {
            onImageClick?.(index);
        }, [onImageClick, index]);

        // Animated styles for parallax effect
        const animatedStyle = useAnimatedStyle(() => {
            const inputRange = [index - 1, index, index + 1];

            // Scale interpolation
            const scale = interpolate(
                progress.value,
                inputRange,
                [0.85, 1, 0.85],
                Extrapolate.CLAMP
            );

            // Parallax effect
            const translateX = interpolate(
                progress.value,
                inputRange,
                [-40, 0, 40],
                Extrapolate.CLAMP
            );

            return {
                transform: [{ scale }, { translateX }],
            };
        }, [progress, index]);

        if (!source) {
            return (
                <View
                    style={{
                        height: 220,
                        width: Dimensions.get("window").width - 32,
                        backgroundColor: "#000000",
                        borderRadius: 15,
                    }}
                />
            );
        }

        return (
            <AnimatedPressable
                onPress={handlePress}
                style={[
                    {
                        width: Dimensions.get("window").width - 32,
                        height: 220,
                        backgroundColor: "#000000",
                        borderRadius: 15,
                        overflow: "hidden",
                    },
                    animatedStyle,
                ]}
            >
                <Image
                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 15,
                    }}
                    source={{
                        uri: source,
                        cachePolicy: "memory-disk",
                    }}
                    contentFit="cover"
                    transition={200}
                    recyclingKey={`${source}-${index}`}
                />
            </AnimatedPressable>
        );
    }
);

SlideItem.displayName = "SlideItem";

export default SlideItem;
