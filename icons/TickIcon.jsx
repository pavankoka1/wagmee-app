import React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";

const TickIcon = ({ color = "white", width = 16, height = 16 }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
            <G clipPath="url(#clip0_681_772)">
                <Path
                    d="M6.6665 10.115L12.7945 3.98633L13.7378 4.92899L6.6665 12.0003L2.42383 7.75766L3.3665 6.81499L6.6665 10.115Z"
                    fill={color}
                />
            </G>
            <Defs>
                <ClipPath id="clip0_681_772">
                    <Rect width="16" height="16" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
};

export default TickIcon;
