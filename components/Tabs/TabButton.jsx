import { TouchableOpacity, Text } from "react-native";

const TabButton = ({ title, isActive, onPress, className }) => (
    <TouchableOpacity
        className={className}
        onPress={onPress}
        style={{
            flex: 1,
            paddingVertical: 12,
            backgroundColor: "#161616",
        }}
    >
        <Text
            style={{
                color: isActive ? "#b4ef02" : "#666666",
                fontSize: 14,
                fontFamily: "Manrope-Bold",
                textAlign: "center",
            }}
        >
            {title}
        </Text>
    </TouchableOpacity>
);

export default TabButton;
