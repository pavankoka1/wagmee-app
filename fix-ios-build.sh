#!/bin/bash

echo "🔧 iOS Build Fix Script"
echo "======================"
echo ""

cd /Users/snehithneelagiri/Documents/personal/wagmee-app

# Step 1: Use correct Node version
echo "1️⃣ Switching to Node v22.18.0..."
nvm use
echo ""

# Step 2: Clean iOS build artifacts
echo "2️⃣ Cleaning iOS build artifacts..."
cd ios
rm -rf build WagmeeClub.xcarchive DerivedData
rm -rf ~/Library/Developer/Xcode/DerivedData/WagmeeClub-*
echo "✅ Cleaned build artifacts"
echo ""

# Step 3: Clean and reinstall Pods
echo "3️⃣ Reinstalling CocoaPods dependencies..."
rm -rf Pods Podfile.lock
pod install --repo-update
echo "✅ Pods reinstalled"
echo ""

# Step 4: Clean Xcode workspace
echo "4️⃣ Cleaning Xcode workspace..."
xcodebuild clean -workspace WagmeeClub.xcworkspace -scheme WagmeeClub 2>&1 > /dev/null
echo "✅ Workspace cleaned"
echo ""

# Step 5: Open Xcode
echo "5️⃣ Opening Xcode..."
open WagmeeClub.xcworkspace
echo "✅ Xcode opened"
echo ""

echo "======================"
echo "✅ Fix script completed!"
echo ""
echo "📝 Next steps in Xcode:"
echo "   1. Select 'Any iOS Device' as destination"
echo "   2. Go to Signing & Capabilities"
echo "   3. Enable 'Automatically manage signing'"
echo "   4. Select your team: 6WDAS3C945"
echo "   5. Product → Archive"
echo "======================"
