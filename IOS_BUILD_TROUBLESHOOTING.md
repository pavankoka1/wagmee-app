# iOS Build Troubleshooting Guide

## Common Build Errors & Solutions

### 1. **Code Signing Issues** (Most Common)

**Error:** 
- "Code signing is required"
- "No profiles found"
- "Signing for "WagmeeClub" requires a development team"

**Solution:**
1. Open Xcode → WagmeeClub project
2. Select "WagmeeClub" target
3. Go to "Signing & Capabilities" tab
4. Enable "Automatically manage signing"
5. Select your team: **6WDAS3C945**
6. Ensure Bundle Identifier is: **com.trade.tribe**

### 2. **Missing Provisioning Profile**

**Error:** "Provisioning profile specified in your build settings..."

**Solution:**
1. Xcode → Preferences → Accounts
2. Add your Apple ID if not present
3. Download manual profiles
4. Clean build folder (Cmd+Shift+K)
5. Try building again

### 3. **Pod Installation Issues**

**Error:** "The sandbox is not in sync with the Podfile.lock"

**Solution:**
```bash
cd wagmee-app/ios
rm -rf Pods Podfile.lock
pod install
```

### 4. **Node Version Mismatch**

**Error:** Build fails with Node-related errors

**Solution:**
```bash
cd wagmee-app
nvm use
# Should switch to v22.18.0
```

### 5. **DEFINES_MODULE Warning**

**Warning:** "Can't merge pod_target_xcconfig for pod targets"

**Status:** ✅ This is a known Expo warning, SAFE TO IGNORE

### 6. **Archive Build Fails but Simulator Works**

**Error:** Builds for simulator but not for archive

**Solution:**
1. Select "Any iOS Device" instead of simulator
2. Product → Clean Build Folder
3. Quit and reopen Xcode
4. Try Product → Archive again

### 7. **Missing iOS Directory**

**Error:** No iOS folder found

**Solution:**
```bash
cd wagmee-app
npx expo prebuild --platform ios --clean
```

### 8. **React Native Codegen Errors**

**Error:** "Codegen did not run properly"

**Solution:**
```bash
cd wagmee-app/ios
rm -rf Pods Podfile.lock
pod install
```

### 9. **Xcode Version Issues**

**Error:** Build fails due to Xcode version

**Solution:**
- Ensure you're using Xcode 15.x or later
- Update Xcode from Mac App Store if needed
- Command Line Tools: `xcode-select --install`

### 10. **Bitcode Issues**

**Error:** Bitcode compilation fails

**Solution:** Already disabled in exportOptions.plist ✅

---

## Quick Fix Script

Run this to fix most common issues:

```bash
cd /Users/snehithneelagiri/Documents/personal/wagmee-app

# Use correct Node version
nvm use

# Clean iOS build
cd ios
rm -rf build DerivedData
rm -rf Pods Podfile.lock

# Reinstall pods
pod install --repo-update

# Clean Xcode build
xcodebuild clean -workspace WagmeeClub.xcworkspace -scheme WagmeeClub

# Open Xcode
open WagmeeClub.xcworkspace
```

---

## Step-by-Step Archive Process

1. **Open Xcode**
   - File → Open → Select `ios/WagmeeClub.xcworkspace`
   - ⚠️ Always open `.xcworkspace`, NOT `.xcodeproj`

2. **Verify Settings**
   - Target: WagmeeClub
   - Destination: **Any iOS Device** (not simulator)
   - Scheme: WagmeeClub

3. **Signing**
   - Select target → Signing & Capabilities
   - Team: Your team or 6WDAS3C945
   - Bundle ID: com.trade.tribe
   - ✅ Automatically manage signing

4. **Archive**
   - Product → Archive
   - Wait 5-10 minutes
   - Xcode Organizer will open

5. **Distribute**
   - Click "Distribute App"
   - Choose "App Store Connect"
   - Follow upload wizard

---

## Still Having Issues?

### Get Detailed Error Log:
1. In Xcode, open the "Report Navigator" (left sidebar, document icon)
2. Find your latest build
3. Click to see full error details
4. Copy the error message

### Check Build Log:
```bash
# View last build log
grep -i "error" ~/Library/Developer/Xcode/DerivedData/WagmeeClub-*/Logs/Build/*.log | tail -20
```

### Try Expo Doctor:
```bash
cd wagmee-app
npx expo-doctor
```

---

## Verification Checklist

Before building, ensure:
- [x] Node v22.18.0 (via `nvm use`)
- [x] Pods installed (`pod install`)
- [x] Version 1.0.1, Build 2
- [x] Bundle ID: com.trade.tribe
- [x] Team selected in Xcode
- [x] Signing enabled
- [x] "Any iOS Device" selected
- [x] Clean build folder

---

**Most likely issue:** Code signing not configured in Xcode

**Quick fix:** Open Xcode → Signing & Capabilities → Enable automatic signing → Select team
