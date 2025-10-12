# Quick Start Guide - App Store Resubmission

## 🎯 What Was Fixed

All three App Store rejection issues have been resolved:

### ✅ Issue 1: Sign in with Apple

-   Apple login is now the **PRIMARY** login option (shown first)
-   Fully compliant with Apple's data privacy requirements

### ✅ Issue 2: In-App Authentication

-   Login now uses Safari View Controller (in-app browser)
-   No more external browser redirects
-   Seamless user experience

### ✅ Issue 3: User-Generated Content Safety

-   EULA acceptance on first login
-   Post reporting system
-   User reporting system
-   User blocking system
-   24-hour moderation commitment (documented in policies)

---

## 🚀 Before You Resubmit

### 1. Test Everything

```bash
# Build and test on iOS
npm run ios

# OR build locally
npm run build-local
```

**Test Checklist:**

-   [ ] Apple Sign In button appears first on login
-   [ ] Login opens in-app (not external browser)
-   [ ] EULA modal appears on first login
-   [ ] Three-dots menu on posts allows reporting
-   [ ] Three-dots menu on user profiles allows reporting/blocking
-   [ ] Settings page shows Legal & Policies section

### 2. Backend API Implementation Required ⚠️

Create these endpoints on your backend:

```javascript
POST / api / v1 / moderation / report / post;
POST / api / v1 / moderation / report / user;
POST / api / v1 / moderation / block;
DELETE / api / v1 / moderation / block / { blockerId } / { blockedUserId };
GET / api / v1 / moderation / blocked / { userId };
```

**API Details:** See `APP_STORE_FIXES_SUMMARY.md` section "Backend Requirements"

### 3. Update Screenshots (if needed)

If your App Store screenshots show the login screen, update them to display:

-   Sign in with Apple as the top button
-   Google and Facebook below it
-   Terms & Privacy links visible at bottom

### 4. Bump Version

```bash
# Bump version and build number
npm run bump-build-release
```

### 5. Build for Release

**Android:**

```bash
npm run build-local-release
```

**iOS:**

```bash
npm run build-ios
# Or use EAS
eas build -p ios --profile production
```

---

## 📱 How to Test Features

### EULA Modal

1. Fresh install or clear app data
2. Login with any provider
3. EULA modal should appear before entering app
4. Check all policy links work
5. Confirm acceptance is required

### Post Reporting

1. Go to any post (not yours)
2. Tap three-dots icon (top right of post)
3. Select "Report Post"
4. Choose a reason
5. Submit report
6. Should see "We'll review within 24 hours" message

### User Blocking

**From Post:**

1. Tap three-dots on any post
2. Select "Block User"
3. Confirm in dialog
4. User should be blocked

**From Profile:**

1. Tap user's profile
2. Tap three-dots (top of profile)
3. Select "Block User"
4. Confirm in dialog

### Settings Policies

1. Go to Profile
2. Tap Settings (gear icon)
3. Scroll down to "Legal & Policies"
4. Tap each policy link
5. Should open in Safari View Controller

---

## 📝 App Review Response

When Apple asks for explanation, copy this response:

**File:** `APP_STORE_FIXES_SUMMARY.md` → Section "App Review Response Template"

Key points to mention:

-   ✅ Sign in with Apple is now **primary** login option
-   ✅ Safari View Controller for in-app authentication
-   ✅ Comprehensive EULA with zero-tolerance policy
-   ✅ User flagging and blocking mechanisms
-   ✅ 24-hour moderation commitment in policies

---

## 🔧 Files You Might Need to Modify

### If you need to customize text:

-   `components/auth/EulaAcceptanceModal.jsx` - EULA modal content
-   `components/home/PostOptionsBottomSheet.jsx` - Post reporting
-   `components/profile/UserOptionsBottomSheet.jsx` - User reporting

### If you need to change report categories:

Look for `reportTypes` array in:

-   `PostOptionsBottomSheet.jsx` (line ~35)
-   `UserOptionsBottomSheet.jsx` (line ~27)

---

## 🐛 Common Issues & Solutions

### Issue: EULA not showing

**Solution:** Clear app data or check `SecureStore` for `eula_accepted` key

### Issue: Report button not showing

**Solution:** Make sure you're not viewing your own post/profile

### Issue: Three-dots menu not clickable

**Solution:** Check if `PostOptionsBottomSheet` is imported in `PostHeader.jsx`

### Issue: Backend API errors

**Solution:** Implement the moderation endpoints (see Backend Requirements)

---

## 📊 What Changed - Quick Summary

**New Features:**

-   🍎 Apple Sign In (primary login)
-   📋 EULA acceptance modal
-   🚩 Report posts mechanism
-   🚩 Report users mechanism
-   🚫 Block users functionality
-   📄 Policy links in Settings

**New Files (9):**

-   AppleIcon.jsx
-   FlagIcon.jsx
-   BlockIcon.jsx
-   EulaAcceptanceModal.jsx
-   PostOptionsBottomSheet.jsx
-   UserOptionsBottomSheet.jsx
-   APP_STORE_FIXES_SUMMARY.md
-   QUICK_START_GUIDE.md (this file)

**Modified Files (6):**

-   LoginContent.jsx
-   PostHeader.jsx
-   UserProfileBottomSheet.jsx
-   SettingsBottomSheet.jsx
-   apis.js
-   redirect.jsx

---

## 📞 Need Help?

**Documentation:**

-   Detailed explanation: `APP_STORE_FIXES_SUMMARY.md`
-   This guide: `QUICK_START_GUIDE.md`

**Check:**

-   All policy URLs are accessible:
    -   https://wagmee.in/terms.html
    -   https://wagmee.in/privacy.html
    -   https://wagmee.in/saftey-policy.html

---

## ✨ Final Checklist Before Submission

-   [ ] Tested Apple Sign In login flow
-   [ ] Tested in-app authentication (Safari View Controller)
-   [ ] EULA modal works on first login
-   [ ] Post reporting works
-   [ ] User reporting works
-   [ ] User blocking works
-   [ ] All policy links work
-   [ ] Backend APIs implemented
-   [ ] Version bumped
-   [ ] Screenshots updated (if showing login)
-   [ ] App Store response prepared
-   [ ] Build created and uploaded

---

**Status:** ✅ Ready for Testing  
**Next Step:** Test thoroughly, implement backend APIs, then resubmit to App Store

🎉 Good luck with your resubmission!
