import clsx from "clsx";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
    Animated,
    Easing,
    Modal,
    TouchableWithoutFeedback,
    View,
} from "react-native";

const EmailAuthBottomSheet = ({
    isOpen,
    className,
    onClose,
    children,
    closeOnOverlayClick = true,
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
            <View
                className="flex-1 justify-end"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
                <TouchableWithoutFeedback onPress={handleOverlayClick}>
                    <View className="flex-1" />
                </TouchableWithoutFeedback>
                <Animated.View
                    style={[
                        { transform: [{ translateY }] },
                        { paddingTop: 5, paddingBottom: 5 },
                    ]}
                    className={clsx(
                        "bg-[#161616] w-full rounded-t-3xl shadow-2xl",
                        className
                    )}
                >
                    {children}
                </Animated.View>
            </View>
        </Modal>
    );
};

EmailAuthBottomSheet.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node,
    closeOnOverlayClick: PropTypes.bool,
};

export default EmailAuthBottomSheet;
