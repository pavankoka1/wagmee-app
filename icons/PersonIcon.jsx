import React from "react";
import { Svg, Path } from "react-native-svg";

const PersonIcon = ({ color = "white", size = 20 }) => (
    <Svg width={size} height={size * (19 / 20)} viewBox="0 0 20 19" fill="none">
        <Path
            d="M0.800293 18C3.13608 15.5226 6.30731 14 9.80029 14C13.2933 14 16.4645 15.5226 18.8003 18M14.3003 5.5C14.3003 7.98528 12.2856 10 9.80029 10C7.31501 10 5.30029 7.98528 5.30029 5.5C5.30029 3.01472 7.31501 1 9.80029 1C12.2856 1 14.3003 3.01472 14.3003 5.5Z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default PersonIcon;
