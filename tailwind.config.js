/** @type {import('tailwindcss').Config} */
module.exports = {
    // Update this to include the paths to all of your component files.
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}", // Add this line for the components folder
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: "#ddf88b",
                    main: "#b4ef02",
                    dark: "#80aa01",
                    contrast: "#000000",
                },
                secondary: {
                    light: "#af91fa",
                    main: "#875bf7",
                    dark: "#6041af",
                    contrast: "#000000",
                },
            },
            fontSize: {
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
            fontFamily: {
                manrope: ["Manrope-Regular", "sans-serif"],
                "manrope-bold": ["Manrope-Bold", "sans-serif"],
                "manrope-semibold": ["Manrope-SemiBold", "sans-serif"],
                "manrope-medium": ["Manrope-Medium", "sans-serif"],
                "manrope-light": ["Manrope-Thin", "sans-serif"],
                "manrope-extrabold": ["Manrope-ExtraBold", "sans-serif"],
                "manrope-extralight": ["Manrope-ExtraThin", "sans-serif"],
            },
        },
    },
    plugins: [],
};
