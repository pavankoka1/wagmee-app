import React from "react";
import Svg, { Path } from "react-native-svg";

const FlagIcon = ({ color = "#fff", size = 20 }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M4 15V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V13C20 13.5523 19.5523 14 19 14H6L4 15Z"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M4 15V21"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default FlagIcon;
