import React from "react";
import { Svg, Rect, Path } from "react-native-svg";

const AddIcon = ({ color = "white", size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="0.5" y="0.5" width="23" height="23" rx="5.5" stroke={color} />
        <Path
            d="M12 7V17M7 12H17"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default AddIcon;
