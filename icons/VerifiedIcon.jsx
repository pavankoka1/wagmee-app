import React from "react";
import { Svg, Path } from "react-native-svg";

const VerifiedIcon = ({
    color = "#875BF7",
    width = 16,
    height = 16,
    ...props
}) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 16 16"
        fill="none"
        {...props}
    >
        <Path
            d="M6.34286 14L5.25714 12.1714L3.2 11.7143L3.4 9.6L2 8L3.4 6.4L3.2 4.28571L5.25714 3.82857L6.34286 2L8.28571 2.82857L10.2286 2L11.3143 3.82857L13.3714 4.28571L13.1714 6.4L14.5714 8L13.1714 9.6L13.3714 11.7143L11.3143 12.1714L10.2286 14L8.28571 13.1714L6.34286 14ZM7.68571 10.0286L10.9143 6.8L10.1143 5.97143L7.68571 8.4L6.45714 7.2L5.65714 8L7.68571 10.0286Z"
            fill={color}
        />
    </Svg>
);

export default VerifiedIcon;
