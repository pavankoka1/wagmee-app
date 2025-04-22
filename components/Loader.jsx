import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    interpolate,
} from "react-native-reanimated";

const NUM_CIRCLES = 16; // Increased the number of circles
const CIRCLE_BASE_SIZE = 20; // Base size of the ripples
const whiteShades = ["#ffffff", "#f8f8f8", "#f0f0f0", "#e8e8e8", "#d8d8d8"]; // Soft shades of white

const RippleLoader = () => {
    // Create an array of shared values for each ripple layer
    const scales = Array.from({ length: NUM_CIRCLES }, () => useSharedValue(0));

    // Start the pulsing effect for each ripple layer
    React.useEffect(() => {
        scales.forEach((scale, index) => {
            scale.value = withRepeat(
                withTiming(1, {
                    duration: 1500 + 500 * index, // Longer animation duration for smoother effect
                    easing: Easing.out(Easing.quad), // Softer easing function
                }),
                -1,
                true // Reverse the animation
            );
        });
    }, [scales]);

    return (
        <View style={styles.container}>
            {scales.map((scale, index) => {
                // Create the animated styles for each ripple layer
                const animatedScaleStyle = useAnimatedStyle(() => ({
                    transform: [{ scale: scale.value }],
                    opacity: interpolate(scale.value, [0, 1], [0.2, 0]), // Subtle fading out
                }));

                return (
                    <Animated.View
                        key={index}
                        style={[
                            animatedScaleStyle,
                            styles.ripple,
                            {
                                width: CIRCLE_BASE_SIZE + index * 10, // Adjusting size increment for more circles
                                height: CIRCLE_BASE_SIZE + index * 10,
                                backgroundColor:
                                    whiteShades[index % whiteShades.length], // Shades of white
                            },
                        ]}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#161616", // Dark background
    },
    ripple: {
        position: "absolute",
        borderRadius: 100, // Fully rounded circles
    },
});

export default RippleLoader;
