// fontLoader.js
import * as Font from "expo-font"; // Make sure to install expo-font if you're using Expo
import MANROPE_REGULAR from "@/assets/fonts/Manrope-Regular.ttf";
import MANROPE_THIN from "@/assets/fonts/Manrope-Light.ttf";
import MANROPE_MEDIUM from "@/assets/fonts/Manrope-Medium.ttf";
import MANROPE_SEMIBOLD from "@/assets/fonts/Manrope-SemiBold.ttf";
import MANROPE_BOLD from "@/assets/fonts/Manrope-Bold.ttf";
import MANROPE_EXTRABOLD from "@/assets/fonts/Manrope-ExtraBold.ttf";
import MANROPE_EXTRATHIN from "@/assets/fonts/Manrope-ExtraLight.ttf";

const loadFonts = async () => {
    await Font.loadAsync({
        "Manrope-ExtraThin": MANROPE_EXTRATHIN,
        "Manrope-ExtraBold": MANROPE_EXTRABOLD,
        "Manrope-Bold": MANROPE_BOLD,
        "Manrope-SemiBold": MANROPE_SEMIBOLD,
        "Manrope-Medium": MANROPE_MEDIUM,
        "Manrope-Regular": MANROPE_REGULAR,
        "Manrope-Thin": MANROPE_THIN,
    });
};

export default loadFonts;
