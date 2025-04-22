import React from "react";
import { View, Text } from "react-native";

const LetterIcon = ({
    fullName = "",
    backgroundColor = "#000",
    textColor = "#FFF",
}) => {
    // Split the full name into words and get the first two letters of the first two words
    const words = fullName.split(" ");
    const letters = words
        .slice(0, 2) // Get the first two words
        .map((word) => word.charAt(0).toUpperCase()) // Get the first letter of each word and capitalize it
        .join(""); // Join the letters together

    // If no letters are found, use a default character
    const displayText = letters.length > 0 ? letters : "?"; // Use "?" if no letters are available

    return (
        <View
            style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: backgroundColor,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text
                style={{ color: textColor }}
                className="font-manrope-bold text-16"
            >
                {displayText}
            </Text>
        </View>
    );
};

export default LetterIcon;
