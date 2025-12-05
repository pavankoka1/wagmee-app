#!/bin/bash

# Script to validate AAB before Google Play submission
# Usage: ./scripts/validateAAB.sh

AAB_PATH="android/app/build/outputs/bundle/release/app-release.aab"

if [ ! -f "$AAB_PATH" ]; then
    echo "❌ AAB file not found at: $AAB_PATH"
    echo "Please build the AAB first: cd android && ./gradlew bundleRelease"
    exit 1
fi

echo "🔍 Validating AAB: $AAB_PATH"
echo ""

# Check AAB size
AAB_SIZE=$(du -h "$AAB_PATH" | cut -f1)
echo "📦 AAB Size: $AAB_SIZE"
echo ""

# Check extractNativeLibs in manifest
echo "✅ Checking extractNativeLibs in manifest..."
EXTRACT_CHECK=$(unzip -p "$AAB_PATH" base/manifest/AndroidManifest.xml 2>/dev/null | strings | grep -i "extractNativeLibs" | head -1)
if [ -n "$EXTRACT_CHECK" ]; then
    echo "   ✓ Found: $EXTRACT_CHECK"
    TRUE_CHECK=$(unzip -p "$AAB_PATH" base/manifest/AndroidManifest.xml 2>/dev/null | strings | grep -i "true" | grep -i "extractNativeLibs" -A1 | grep -i "true")
    if [ -n "$TRUE_CHECK" ]; then
        echo "   ✓ Value appears to be set correctly"
    else
        echo "   ⚠️  Warning: extractNativeLibs found but value unclear"
    fi
else
    echo "   ❌ extractNativeLibs NOT FOUND in manifest!"
    echo "   This will cause 16KB page size rejection!"
fi
echo ""

# Check for native libraries
echo "📚 Checking native libraries..."
NATIVE_LIBS=$(unzip -l "$AAB_PATH" 2>/dev/null | grep "\.so$" | wc -l | tr -d ' ')
if [ "$NATIVE_LIBS" -gt 0 ]; then
    echo "   ✓ Found $NATIVE_LIBS native libraries (.so files)"
    
    # Check architectures
    ARCHS=$(unzip -l "$AAB_PATH" 2>/dev/null | grep "\.so$" | grep -oE "(arm64-v8a|armeabi-v7a|x86|x86_64)" | sort -u | tr '\n' ' ')
    echo "   ✓ Architectures: $ARCHS"
    
    # Warn if x86/x86_64 are included (not needed for production)
    if echo "$ARCHS" | grep -q "x86"; then
        echo "   ⚠️  Warning: x86/x86_64 architectures included (not needed for production, increases size)"
    fi
else
    echo "   ⚠️  No native libraries found"
fi
echo ""

# Check version info
echo "📋 Version Information:"
VERSION_CODE=$(unzip -p "$AAB_PATH" BUNDLE-METADATA/com.android.tools.build.gradle/app-metadata.properties 2>/dev/null | grep "versionCode" | cut -d'=' -f2)
VERSION_NAME=$(unzip -p "$AAB_PATH" BUNDLE-METADATA/com.android.tools.build.gradle/app-metadata.properties 2>/dev/null | grep "versionName" | cut -d'=' -f2)
if [ -n "$VERSION_CODE" ]; then
    echo "   Version Code: $VERSION_CODE"
fi
if [ -n "$VERSION_NAME" ]; then
    echo "   Version Name: $VERSION_NAME"
fi
echo ""

# Check if bundletool is available
if command -v bundletool &> /dev/null; then
    echo "🔧 Using bundletool for advanced validation..."
    echo ""
    
    # Validate with bundletool
    bundletool validate --bundle="$AAB_PATH" 2>&1 | head -20
    echo ""
    
    # Get app size info
    echo "📊 App Size Information:"
    bundletool get-size total --bundle="$AAB_PATH" 2>/dev/null || echo "   (Size calculation not available)"
    echo ""
else
    echo "💡 Tip: Install bundletool for advanced validation:"
    echo "   Download from: https://github.com/google/bundletool/releases"
    echo "   Or install via: brew install bundletool (if on macOS with Homebrew)"
    echo ""
fi

echo "✅ Basic validation complete!"
echo ""
echo "📝 Next Steps:"
echo "   1. Upload to Google Play Console (Internal Testing track first)"
echo "   2. Check the 'Memory page size' field in App Bundle Explorer"
echo "   3. If 16KB error persists, check which specific library Google Play identifies"
echo ""

