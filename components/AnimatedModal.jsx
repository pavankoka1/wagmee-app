import React, { useEffect, useState } from "react";
import {
    View,
    Modal,
    TouchableWithoutFeedback,
    StyleSheet,
    Animated,
    Text,
    Button,
    Pressable,
} from "react-native";
import PropTypes from "prop-types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const AnimatedModal = ({ isVisible, onClose, children }) => {
    const [isVisibleState, setIsVisibleState] = useState(isVisible);
    const [opacity] = useState(new Animated.Value(0)); // Start fully transparent

    useEffect(() => {
        if (isVisible) {
            setIsVisibleState(true);
            Animated.timing(opacity, {
                toValue: 1, // Fully opaque
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(opacity, {
                toValue: 0, // Fully transparent
                duration: 300,
                useNativeDriver: true,
            }).start(() => setIsVisibleState(false)); // Hide modal after animation
        }
    }, [isVisible, opacity]);

    return (
        <Modal
            transparent
            visible={isVisibleState}
            animationType="none"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <Animated.View style={[styles.modal, { opacity }]}>
                        {children}
                        <Pressable onPress={onClose} style={styles.closeIcon}>
                            <MaterialCommunityIcons
                                name="close"
                                size={24}
                                color="#010101"
                                selectable={undefined}
                            />
                        </Pressable>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

AnimatedModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node,
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modal: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5, // Android shadow
    },
    closeIcon: {
        position: "absolute",
        top: 15,
        right: 15,
        cursor: "pointer",
    },
});

export default AnimatedModal;
