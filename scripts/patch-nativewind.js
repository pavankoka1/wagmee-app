#!/usr/bin/env node

/**
 * Patch script to fix NativeWind v4 / react-native-css-interop
 *
 * Issue: react-native-css-interop hardcodes 'react-native-worklets/plugin'
 * but we're using react-native-reanimated which already provides worklets.
 *
 * This script removes the conflicting worklets plugin reference.
 */

const fs = require("fs");
const path = require("path");

const babelFilePath = path.join(
    __dirname,
    "../node_modules/react-native-css-interop/babel.js"
);

try {
    if (!fs.existsSync(babelFilePath)) {
        console.log(
            "⚠️  react-native-css-interop/babel.js not found, skipping patch"
        );
        process.exit(0);
    }

    let content = fs.readFileSync(babelFilePath, "utf8");

    // Check if already patched
    if (!content.includes("react-native-worklets/plugin")) {
        console.log("✅ react-native-css-interop already patched");
        process.exit(0);
    }

    // Remove the worklets plugin line
    content = content.replace(
        /,\s*\/\/ Use this plugin in reanimated 4 and later\s*"react-native-worklets\/plugin",/,
        ",\n      // Worklets plugin removed - using react-native-reanimated/plugin instead"
    );

    // Write back the patched content
    fs.writeFileSync(babelFilePath, content, "utf8");

    console.log(
        "✅ Successfully patched react-native-css-interop babel config"
    );
} catch (error) {
    console.error("❌ Error patching react-native-css-interop:", error.message);
    // Don't fail the install if patching fails
    process.exit(0);
}
