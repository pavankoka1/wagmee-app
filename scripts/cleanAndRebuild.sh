#!/bin/bash

# Comprehensive clean and rebuild script for 16KB page size support
# This script ensures all native libraries are rebuilt from scratch

set -e

ANDROID_DIR="android"
APP_DIR="$ANDROID_DIR/app"

echo "🧹 Starting comprehensive clean for 16KB page size support..."
echo ""

# Step 1: Clean Gradle build
echo "📦 Step 1: Cleaning Gradle build..."
cd "$ANDROID_DIR" || exit 1
./gradlew clean
cd ..

# Step 2: Remove build artifacts
echo ""
echo "🗑️  Step 2: Removing build artifacts..."
rm -rf "$APP_DIR/.cxx"
rm -rf "$APP_DIR/build"
rm -rf "$ANDROID_DIR/build"
rm -rf "$ANDROID_DIR/.gradle"

# Step 3: Clear Gradle cache for native libraries
echo ""
echo "💾 Step 3: Clearing Gradle transform cache..."
rm -rf ~/.gradle/caches/transforms-*

# Step 4: Remove any existing AAB files
echo ""
echo "📦 Step 4: Removing existing AAB files..."
rm -f "$APP_DIR/build/outputs/bundle/release/app-release.aab"
rm -f "$APP_DIR/build/outputs/apk/release/app-release.apk"

# Step 5: Rebuild with clean state
echo ""
echo "🔨 Step 5: Rebuilding AAB with clean state..."
echo "   This will ensure all native libraries are rebuilt with NDK r28+"
echo "   and proper 16KB page size alignment..."
cd "$ANDROID_DIR" || exit 1
./gradlew bundleRelease --no-daemon --no-build-cache

echo ""
echo "✅ Clean rebuild complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Validate the AAB: bundletool validate --bundle=app/build/outputs/bundle/release/app-release.aab"
echo "   2. Check manifest: unzip -p app/build/outputs/bundle/release/app-release.aab base/manifest/AndroidManifest.xml | strings | grep extractNativeLibs"
echo "   3. Upload to Google Play Console (Internal Testing track first)"
echo ""

