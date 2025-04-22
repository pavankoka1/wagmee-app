// styleGenerator.js
const typography = {
    fontSizes: {
        8: "8px",
        10: "10px",
        12: "12px",
        14: "14px",
        16: "16px",
        18: "18px",
        20: "20px",
        24: "24px",
        28: "28px",
        32: "32px",
        34: "34px",
        40: "40px",
        44: "44px",
        48: "48px",
    },
    fontWeights: {
        eb: "Montserrat-ExtraBold",
        b: "Montserrat-Bold",
        sb: "Montserrat-SemiBold",
        m: "Montserrat-Medium",
        r: "Montserrat-Regular",
        t: "Montserrat-Thin",
    },
    fontFamilies: {
        montserrat: "Montserrat", // Reference here, actual names defined in global.css
        denton: "Denton, serif", // Optional: Add more fonts as needed
    },
};

const generateDynamicStyles = () => {
    let styles = ``;

    // Generate styles for each combination of font-family, weight, and size
    Object.keys(typography.fontFamilies).forEach((family) => {
        Object.keys(typography.fontWeights).forEach((weight) => {
            Object.keys(typography.fontSizes).forEach((size) => {
                styles += `  
            .${family}-${weight}-${size} {  
              font-family: ${typography.fontWeights[weight]};  
              font-size: ${typography.fontSizes[size]};  
            }  
          `;
            });
        });
    });

    return styles;
};

export default generateDynamicStyles;
