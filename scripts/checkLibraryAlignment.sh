#!/bin/bash

# Script to extract and check 16KB alignment of all native libraries in AAB
# This helps identify which specific library is causing the 16KB page size error

AAB_PATH="android/app/build/outputs/bundle/release/app-release.aab"

if [ ! -f "$AAB_PATH" ]; then
    echo "❌ AAB file not found at $AAB_PATH"
    exit 1
fi

echo "🔍 Extracting and checking 16KB alignment of native libraries..."
echo ""

# Create temp directory
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Extract AAB
echo "📦 Extracting AAB..."
unzip -q "$AAB_PATH" -d "$TEMP_DIR"

# Find all .so files
echo "📚 Checking native libraries for 16KB alignment..."
echo ""

MISALIGNED_FOUND=false

# Check each architecture
for ARCH in arm64-v8a armeabi-v7a; do
    LIB_DIR="$TEMP_DIR/base/lib/$ARCH"
    if [ ! -d "$LIB_DIR" ]; then
        continue
    fi
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📱 Architecture: $ARCH"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    for SO_FILE in "$LIB_DIR"/*.so; do
        if [ ! -f "$SO_FILE" ]; then
            continue
        fi
        
        LIB_NAME=$(basename "$SO_FILE")
        
        # Check if readelf is available
        if ! command -v readelf &> /dev/null; then
            echo "⚠️  readelf not found. Install binutils to check alignment."
            echo "   Library: $LIB_NAME"
            continue
        fi
        
        # Get LOAD segment alignment using readelf
        ALIGNMENT=$(readelf -l "$SO_FILE" 2>/dev/null | grep -A 1 "LOAD" | grep -oP "Align\s+\K[0-9a-fA-F]+" | head -1)
        
        if [ -z "$ALIGNMENT" ]; then
            echo "⚠️  Could not determine alignment: $LIB_NAME"
            continue
        fi
        
        # Convert hex to decimal
        ALIGN_DECIMAL=$((16#$ALIGNMENT))
        
        # Check if aligned to 16KB (16384 bytes)
        if [ "$ALIGN_DECIMAL" -lt 16384 ]; then
            echo "❌ MISALIGNED: $LIB_NAME"
            echo "   Alignment: $ALIGN_DECIMAL bytes (needs 16384 bytes for 16KB)"
            MISALIGNED_FOUND=true
        else
            echo "✅ Aligned: $LIB_NAME ($ALIGN_DECIMAL bytes)"
        fi
    done
    echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$MISALIGNED_FOUND" = true ]; then
    echo "❌ Found misaligned native libraries!"
    echo ""
    echo "💡 Solutions:"
    echo "   1. Update the library to a version that supports 16KB"
    echo "   2. Contact the library maintainer/vendor"
    echo "   3. If it's a third-party SDK (like Smallcase Gateway), request an updated version"
    exit 1
else
    echo "✅ All checked libraries appear to be aligned for 16KB page size"
    echo ""
    echo "💡 If Google Play still reports the error:"
    echo "   - The issue might be with libraries checked at upload time"
    echo "   - Some libraries might be added during manifest merging"
    echo "   - Contact Google Play support with this report"
fi

