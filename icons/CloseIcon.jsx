import React from "react";
import { Svg, Path } from "react-native-svg";

const CloseIcon = ({ color = "white", size = 14 }) => (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
        <Path
            d="M13 1L1 13M1 1L13 13"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default CloseIcon;
