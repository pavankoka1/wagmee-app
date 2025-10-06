import React from "react";
import { Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginContent from "./LoginContent";

import ARROW from "@/assets/images/login/arrow.png";

const screenWidth = Dimensions.get("window").width;

const LoginScreen = () => {
    return (
        <SafeAreaView className="relative flex-1 w-full bg-[#161616] !py-12 !px-4">
            <Image
                resizeMethod="cover"
                className="absolute left-4 top-1/2 z-0 -translate-y-[260px]"
                source={ARROW}
                style={{
                    width: screenWidth - 32,
                    height: (261 / 335) * (screenWidth - 32),
                }}
            />
            <LoginContent />
        </SafeAreaView>
    );
};

export default LoginScreen;
