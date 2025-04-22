import React from "react";
import { Svg, Path } from "react-native-svg";

const SearchIcon = ({ color = "#fff", size = 21 }) => (
    <Svg width={size} height={size * (20 / 21)} viewBox="0 0 21 20" fill="none">
        <Path
            d="M19.6001 19L16.1002 15.5M18.6001 9.5C18.6001 14.1944 14.7945 18 10.1001 18C5.40568 18 1.6001 14.1944 1.6001 9.5C1.6001 4.80558 5.40568 1 10.1001 1C14.7945 1 18.6001 4.80558 18.6001 9.5Z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default SearchIcon;
