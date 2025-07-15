import React, { useEffect, useState } from "react";
import {
    View,
    Modal,
    TouchableWithoutFeedback,
    Animated,
    Pressable,
    TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";
import CloseIcon from "@/icons/CloseIcon"; // Adjust the import path as necessary
import { Easing } from "react-native"; // Import Easing
import clsx from "clsx";

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
                                "absolute top-4 right-4 p-4 z-[999999]",
                                closeClassName
                            )}
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
