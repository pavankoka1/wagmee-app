// import { getDefaultBasicSettings } from "@/components/CarouselBasicSettingsPanel";
import * as React from "react";
import { Dimensions } from "react-native";

const constants = {
    PAGE_WIDTH: Dimensions.get("window").width,
};

export function useAdvancedSettings(options = {}) {
    const { defaultSettings = {} } = options;
    const [advancedSettings, setAdvancedSettings] =
        React.useState(defaultSettings);

    return {
        advancedSettings: {
            // ...getDefaultBasicSettings(),
            ...advancedSettings,
        },
        onAdvancedSettingsChange: setAdvancedSettings,
        constants,
    };
}
