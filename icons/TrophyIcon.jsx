import { Ionicons } from "@expo/vector-icons";
import React from "react";

const TrophyIcon = ({ color = "#ffffff", size = 26 }) => {
    return <Ionicons name="trophy-outline" color={color} size={size} />;
};

export default TrophyIcon;
