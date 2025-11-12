import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as WebBrowser from "expo-web-browser";

const LoginFooter = () => {
    return (
        <View className="mt-6 px-4">
            <Text className="font-manrope text-11 text-[#B1B1B1] text-center leading-5">
                By continuing, you agree to Wagmee's{" "}
                <Text
                    className="text-primary-main underline"
                    onPress={() => {
                        WebBrowser.openBrowserAsync(
                            "https://wagmee.in/terms.html"
                        );
                    }}
                >
                    Terms of Service
                </Text>
                ,{" "}
                <Text
                    className="text-primary-main underline"
                    onPress={() => {
                        WebBrowser.openBrowserAsync(
                            "https://wagmee.in/privacy.html"
                        );
                    }}
                >
                    Privacy Policy
                </Text>
                , and{" "}
                <Text
                    className="text-primary-main underline"
                    onPress={() => {
                        WebBrowser.openBrowserAsync(
                            "https://wagmee.in/saftey-policy.html"
                        );
                    }}
                >
                    Child Safety Policy
                </Text>
                .
            </Text>
        </View>
    );
};

export default LoginFooter;

