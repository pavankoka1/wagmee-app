import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

const BlockIcon = ({ color = "#fff", size = 20 }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle
                cx="12"
                cy="12"
                r="9"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M4.93 4.93L19.07 19.07"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default BlockIcon;
