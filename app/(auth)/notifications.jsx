import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";

const Notifications = () => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Start the fade-in animation when the component mounts
        Animated.timing(opacity, {
            toValue: 1,
            duration: 1500, // Duration of the fade-in
            useNativeDriver: true,
        }).start();
    }, [opacity]);

    return (
        <View className="flex-1 bg-[#161616] items-center justify-center">
            <Animated.View style={{ opacity }} className="text-center">
                {/* Align text to center */}
                <Text className="text-white text-4xl font-bold text-center">
                    {/* Ensure text is centered */}
                    Coming Soon
                </Text>
                <Text className="mt-4 text-gray-400 text-lg text-center">
                    {/* Ensure text is centered */}
                    Stay tuned for updates!
                </Text>
                <Text className="mt-2 text-primary-main text-md text-center">
                    {/* Ensure text is centered */}
                    Don’t miss out on our news!
                </Text>
            </Animated.View>
        </View>
    );
};

export default Notifications;
