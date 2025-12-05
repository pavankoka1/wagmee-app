#!/bin/bash

# Script to check if native libraries in AAB are aligned for 16KB page size
# This helps identify which libraries might be causing the 16KB page size error

AAB_PATH="android/app/build/outputs/bundle/release/app-release.aab"

if [ ! -f "$AAB_PATH" ]; then
    echo "❌ AAB file not found at $AAB_PATH"
    echo "   Please build the AAB first: cd android && ./gradlew bundleRelease"
    exit 1
fi

echo "🔍 Checking 16KB page size alignment in AAB..."
echo "   AAB: $AAB_PATH"
echo ""

# Extract AAB to temp directory
TEMP_DIR=$(mktemp -d)
echo "📦 Extracting AAB to temporary directory..."
unzip -q "$AAB_PATH" -d "$TEMP_DIR"

# Find all .so files
echo ""
echo "📚 Scanning for native libraries (.so files)..."
SO_FILES=$(find "$TEMP_DIR" -name "*.so")

if [ -z "$SO_FILES" ]; then
    echo "⚠️  No native libraries found in AAB"
    rm -rf "$TEMP_DIR"
    exit 0
fi

echo "   Found $(echo "$SO_FILES" | wc -l | tr -d ' ') native library(ies)"
echo ""

# Check alignment for each .so file
MISALIGNED_COUNT=0
echo "🔬 Checking alignment (16KB = 16384 bytes)..."
echo ""

while IFS= read -r so_file; do
    # Get file name relative to base
    rel_path=$(echo "$so_file" | sed "s|$TEMP_DIR/||")
    
    # Check if file exists and is a valid ELF
    if [ -f "$so_file" ] && file "$so_file" | grep -q "ELF"; then
        # Use readelf to check segment alignment
        # For 16KB support, segments should be aligned to 16384 (0x4000)
        alignment=$(readelf -l "$so_file" 2>/dev/null | grep -i "LOAD" | head -1 | awk '{print $NF}' | sed 's/0x//' | tr '[:lower:]' '[:upper:]')
        
        if [ -n "$alignment" ]; then
            # Convert hex to decimal
            align_decimal=$((16#$alignment))
            
            if [ "$align_decimal" -lt 16384 ]; then
                echo "❌ MISALIGNED: $rel_path"
                echo "   Alignment: $align_decimal bytes (needs 16384 bytes)"
                MISALIGNED_COUNT=$((MISALIGNED_COUNT + 1))
            else
                echo "✅ Aligned: $rel_path ($align_decimal bytes)"
            fi
        else
            echo "⚠️  Could not determine alignment: $rel_path"
        fi
    fi
done <<< "$SO_FILES"

# Cleanup
rm -rf "$TEMP_DIR"

echo ""
if [ "$MISALIGNED_COUNT" -eq 0 ]; then
    echo "✅ All native libraries appear to be aligned for 16KB page size!"
    echo ""
    echo "💡 If Google Play still reports the error, it might be:"
    echo "   1. A false positive (try uploading again)"
    echo "   2. A library that's added during manifest merging"
    echo "   3. A library that's checked at runtime"
    echo ""
    echo "   Try using bundletool for more detailed validation:"
    echo "   bundletool validate --bundle=$AAB_PATH"
else
    echo "❌ Found $MISALIGNED_COUNT misaligned native library(ies)"
    echo ""
    echo "💡 Solutions:"
    echo "   1. Update the library to a version that supports 16KB"
    echo "   2. Contact the library maintainer"
    echo "   3. Rebuild the library from source with NDK r28+"
fi

