#!/bin/bash

echo "Building iOS .ipa file for App Store..."

# Navigate to iOS directory
cd ios

# Clean previous builds
echo "Cleaning previous builds..."
xcodebuild clean -workspace WagmeeClub.xcworkspace -scheme WagmeeClub

# Archive the app
echo "Creating archive..."
xcodebuild -workspace WagmeeClub.xcworkspace -scheme WagmeeClub -configuration Release -destination generic/platform=iOS -archivePath ./WagmeeClub.xcarchive archive

# Check if archive was successful
if [ $? -eq 0 ]; then
    echo "✅ Archive created successfully!"
    echo "Archive location: ./WagmeeClub.xcarchive"
    
    # Export .ipa file
    echo "Exporting .ipa file..."
    xcodebuild -exportArchive -archivePath ./WagmeeClub.xcarchive -exportPath ./build -exportOptionsPlist ../exportOptions.plist
    
    if [ $? -eq 0 ]; then
        echo "✅ .ipa file created successfully!"
        echo "Location: ./build/WagmeeClub.ipa"
        echo ""
        echo "You can now upload this .ipa file to App Store Connect using:"
        echo "1. Transporter app (Mac App Store)"
        echo "2. Xcode Organizer"
        echo "3. Application Loader"
    else
        echo "❌ Failed to export .ipa file"
        exit 1
    fi
else
    echo "❌ Archive failed. Please check your code signing settings in Xcode."
    exit 1
fi
