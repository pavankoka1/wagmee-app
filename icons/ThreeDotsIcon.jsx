import React from "react";
import { Svg, Circle } from "react-native-svg";

const ThreeDotsIcon = ({ width = 24, height = 24, color = "white" }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="1" stroke={color} strokeWidth="2" />
            <Circle cx="12" cy="5" r="1" stroke={color} strokeWidth="2" />
            <Circle cx="12" cy="19" r="1" stroke={color} strokeWidth="2" />
        </Svg>
    );
};

export default ThreeDotsIcon;
