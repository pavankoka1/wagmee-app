import React from "react";
import { Svg, Path } from "react-native-svg";

const ArrowIcon = () => {
    return (
        <Svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <Path
                d="M17 7H1M1 7L7 13M1 7L7 1"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default ArrowIcon;
