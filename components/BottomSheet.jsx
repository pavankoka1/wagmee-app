import CloseIcon from "@/icons/CloseIcon"; // Adjust the import path as necessary
import clsx from "clsx";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
    Animated,
    Easing,
    Modal,
    Platform,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BottomSheet = ({
    isOpen,
    className,
    onClose,
    children,
    closeClassName,
    closeOnOverlayClick = true,
    paddingNeeded = true,
}) => {
    const [isVisible, setIsVisible] = useState(isOpen);
    const [translateY] = useState(new Animated.Value(300)); // Start off-screen
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            Animated.timing(translateY, {
                toValue: 0,
                duration: 400, // Duration for opening
                easing: Easing.out(Easing.cubic), // Easing function for smoother opening
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(translateY, {
                toValue: 300,
                duration: 300, // Duration for closing
                easing: Easing.in(Easing.quad), // Easing function for smoother closing
                useNativeDriver: true,
            }).start(() => setIsVisible(false));
        }
    }, [isOpen]);

    const handleOverlayClick = () => {
        if (closeOnOverlayClick) {
            onClose();
        }
    };

    return (
        <Modal
            transparent
            visible={isVisible}
            animationType="none"
            onRequestClose={onClose}
            presentationStyle="overFullScreen"
        >
            <TouchableWithoutFeedback onPress={handleOverlayClick}>
                <View className="flex-1 justify-end bg-[#161616] bg-opacity-50">
                    <Animated.View
                        style={[{ transform: [{ translateY }] }]}
                        className={clsx(
                            "bg-[#161616] w-full rounded-t-lg  shadow-lg",
                            { "pt-5 px-4": paddingNeeded },
                            className
                        )}
                    >
                        <TouchableOpacity
                            onPress={onClose}
                            className={clsx(
                                "absolute right-4 p-2 z-[999999]",
                                closeClassName
                            )}
                            style={{
                                top:
                                    Platform.OS === "ios"
                                        ? insets.top + 20
                                        : 40,
                            }}
                        >
                            <CloseIcon />
                        </TouchableOpacity>
                        {children}
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

BottomSheet.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node,
    closeOnOverlayClick: PropTypes.bool,
};

export default BottomSheet;
