import React, { useEffect, useState } from "react";
import { View, ImageBackground, StyleSheet } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    interpolate,
    Extrapolate,
} from "react-native-reanimated";

const images = [
    require("@/assets/images/home/wallpaper-1.png"),
    require("@/assets/images/home/wallpaper-2.png"),
    require("@/assets/images/home/wallpaper-3.png"),
    require("@/assets/images/home/wallpaper-4.png"),
];

const App = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const progress = useSharedValue(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, []);

    // Create a looping animation for the wave effect
    useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, { duration: 2000, easing: Easing.linear }),
            Infinity,
            false
        );
    }, [progress]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        progress.value,
                        [0, 1],
                        [-10, 10], // Upwards and downwards wave movement
                        Extrapolate.CLAMP
                    ),
                },
                {
                    scale: interpolate(
                        progress.value,
                        [0, 1],
                        [1, 1.05], // Scale up slightly for a ripple effect
                        Extrapolate.CLAMP
                    ),
                },
            ],
        };
    });

    return (
        <View style={styles.container}>
            <ImageBackground
                source={images[currentIndex]}
                style={styles.background}
                resizeMode="cover"
            />
            <Animated.Image
                source={images[currentIndex]}
                style={[styles.wavyImage, animatedStyle]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    background: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    wavyImage: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        resizeMode: "cover",
        zIndex: 1, // Ensures the wavy image overlays the background image
    },
});

export default App;
