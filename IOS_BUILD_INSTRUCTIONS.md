# iOS Build Instructions for Wagmee Club

## Current Build Configuration
- **App Name:** Wagmee Club
- **Version:** 1.0.1
- **Build Number:** 2
- **Bundle ID:** com.trade.tribe
- **Team ID:** 6WDAS3C945
- **Node Version:** v22.18.0

---

## ✅ Completed Setup

1. ✅ Updated `app.json`: version 1.0.1, buildNumber 2
2. ✅ Updated `Info.plist`: CFBundleShortVersionString 1.0.1, CFBundleVersion 2
3. ✅ Updated Xcode project: MARKETING_VERSION 1.0.1, CURRENT_PROJECT_VERSION 2
4. ✅ Opened Xcode workspace

---

## 📱 Building iOS .ipa File

### Option 1: Using Xcode GUI (Current Method)

**The Xcode project is now open. Follow these steps:**

1. **Select Target**
   - At the top, select "WagmeeClub" scheme
   - Select "Any iOS Device" or your connected device

2. **Product Menu → Archive**
   - Go to: `Product > Archive`
   - Wait for archive to complete (~5-10 minutes)
   
3. **Organizer Window**
   - Xcode will open Organizer automatically
   - Verify version shows 1.0.1 (2)

4. **Distribute App**
   - Click "Distribute App"
   - Select "App Store Connect"
   - Follow prompts to upload

5. **Export .ipa (Optional)**
   - To save .ipa locally, choose "Export"
   - Select "App Store" method
   - Choose team and signing certificates
   - .ipa will be saved to disk

---

### Option 2: Using Command Line Script

You have a bash script ready:

```bash
cd /Users/snehithneelagiri/Documents/personal/wagmee-app
bash build-ios.sh
```

This will:
- Clean previous builds
- Create archive
- Export .ipa file
- Save to `ios/build/WagmeeClub.ipa`

---

### Option 3: Using Xcode Command Line

```bash
cd /Users/snehithneelagiri/Documents/personal/wagmee-app/ios

# Clean
xcodebuild clean -workspace WagmeeClub.xcworkspace -scheme WagmeeClub

# Archive
xcodebuild -workspace WagmeeClub.xcworkspace \
  -scheme WagmeeClub \
  -configuration Release \
  -destination generic/platform=iOS \
  -archivePath ./WagmeeClub.xcarchive archive

# Export .ipa
xcodebuild -exportArchive \
  -archivePath ./WagmeeClub.xcarchive \
  -exportPath ./build \
  -exportOptionsPlist ../exportOptions.plist
```

---

## 🚀 Upload to App Store

### Method 1: Xcode Transporter
1. Open Transporter app (Mac App Store)
2. Drag .ipa file
3. Click "Deliver"

### Method 2: Xcode Organizer
1. After archiving, click "Distribute App"
2. Choose "App Store Connect"
3. Follow upload wizard

### Method 3: App Store Connect Website
1. Go to appstoreconnect.apple.com
2. Navigate to your app
3. Create new version 1.0.1
4. Upload .ipa via website

---

## 🔍 Verification Checklist

Before uploading, verify:

- [x] Version: 1.0.1
- [x] Build: 2
- [x] Bundle ID: com.trade.tribe
- [ ] Code signing configured correctly
- [ ] Encryption compliance: NO (set in Info.plist)
- [ ] Provisioning profile valid
- [ ] Team ID matches: 6WDAS3C945

---

## 📝 Important Files

- `app.json` - Expo configuration
- `Info.plist` - iOS app metadata
- `exportOptions.plist` - Export configuration
- `WagmeeClub.xcworkspace` - Xcode workspace
- `build-ios.sh` - Build script

---

## ⚠️ Troubleshooting

**Code Signing Issues:**
- Open Xcode → Signing & Capabilities
- Select correct team: 6WDAS3C945
- Ensure Automatic Signing is enabled

**Archive Failed:**
- Check Xcode console for errors
- Clean build folder: `Product > Clean Build Folder`
- Reopen Xcode and try again

**Export Failed:**
- Verify `exportOptions.plist` is correct
- Check signing certificates in Keychain
- Ensure provisioning profiles are valid

---

## 📚 Next Steps After Upload

1. Submit for Review in App Store Connect
2. Fill out TestFlight info (if using)
3. Provide screenshots and metadata
4. Answer export compliance questions
5. Set up TestFlight testing (optional)
6. Submit for review

---

**Good luck with your build! 🎉**
