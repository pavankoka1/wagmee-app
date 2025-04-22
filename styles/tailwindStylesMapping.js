// tailwindStylesMapping.js
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
        36: "36px",
        38: "38px",
        40: "40px",
        44: "44px",
        48: "48px",
    },
    fontWeights: {
        eb: "manrope-extrabold", // Adjusted to match Tailwind family names
        b: "manrope-bold",
        sb: "manrope-semibold",
        m: "manrope-medium",
        r: "manrope-regular",
        t: "manrope-light",
        et: "manrope-extralight",
    },
    fontFamilies: {
        man: "manrope", // Simplified to one font family
    },
};

const generateTailwindMapping = () => {
    const mapping = {};

    // Iterate through all combinations of font family, weight, and size
    Object.keys(typography.fontFamilies).forEach((family) => {
        Object.keys(typography.fontWeights).forEach((weight) => {
            Object.keys(typography.fontSizes).forEach((size) => {
                const styleKey = `${family}-${weight}-${size}`; // e.g., 'man-eb-16'
                const fontWeightClass = typography.fontWeights[weight];
                const fontSizeClass = `text-${typography.fontSizes[size]}`; // No 'px' needed for Tailwind

                // Construct Tailwind class string
                mapping[
                    styleKey
                ] = `${fontWeightClass} ${fontSizeClass} font-${fontWeightClass}`;
            });
        });
    });

    return mapping;
};

const tailwindStylesMapping = generateTailwindMapping();
export default tailwindStylesMapping;
