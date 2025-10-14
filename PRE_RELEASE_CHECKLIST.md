# 🚀 Pre-Release Checklist - TradeTribe App

## Before You Submit to App Store

---

## ✅ 1. Authentication Testing

### Google Sign In Flow

-   [ ] Open app → Tap "Continue with Google account"
-   [ ] Safari opens → Auth0 login page appears
-   [ ] Select/enter Google account credentials
-   [ ] Complete authentication
-   [ ] Safari redirects back to app automatically
-   [ ] App shows loader briefly
-   [ ] **First time users:** EULA modal appears → Accept
-   [ ] **First time users:** Onboarding flow appears (if applicable)
-   [ ] **Returning users:** Land on home screen
-   [ ] User is logged in ✅

### Facebook Sign In Flow

-   [ ] Open app → Tap "Continue with Facebook account"
-   [ ] Safari opens → Auth0 login page appears
-   [ ] Select/enter Facebook account credentials
-   [ ] Complete authentication
-   [ ] Safari redirects back to app automatically
-   [ ] App shows loader briefly
-   [ ] **First time users:** EULA modal appears → Accept
-   [ ] **First time users:** Onboarding flow appears (if applicable)
-   [ ] **Returning users:** Land on home screen
-   [ ] User is logged in ✅

### Logout Flow

-   [ ] Navigate to Profile → Settings
-   [ ] Tap "Sign Out"
-   [ ] Confirmation dialog appears (if any)
-   [ ] Confirm sign out
-   [ ] Safari opens briefly for Auth0 logout
-   [ ] Redirects back to app
-   [ ] User lands on login screen
-   [ ] User is logged out ✅

### Re-Login Flow (IMPORTANT - Just Fixed!)

-   [ ] After logout, tap "Continue with Google" or "Continue with Facebook"
-   [ ] **VERIFY:** Auth0 login page shows account selection
-   [ ] **VERIFY:** Does NOT automatically log in with previous account
-   [ ] **VERIFY:** User can choose different account
-   [ ] Complete login with same or different account
-   [ ] Successfully logs in ✅

### Edge Cases

-   [ ] Cancel authentication (close Safari mid-flow)

    -   [ ] App returns to login screen
    -   [ ] No crash or error state
    -   [ ] Can try logging in again

-   [ ] Airplane mode / No internet

    -   [ ] Appropriate error message shown
    -   [ ] App doesn't crash
    -   [ ] Can retry when connection restored

-   [ ] Kill app during authentication
    -   [ ] App restarts on login screen
    -   [ ] Can attempt login again

---

## ✅ 2. App Functionality Testing

### Home Screen / Feed

-   [ ] Posts load correctly
-   [ ] Can scroll through feed
-   [ ] Images load properly
-   [ ] "For You" tab works
-   [ ] "Trending" tab works
-   [ ] Pull to refresh works
-   [ ] Infinite scroll works (load more posts)

### Create Post

-   [ ] Can create text post
-   [ ] Can add images to post
-   [ ] Can tag stocks (if applicable)
-   [ ] Post successfully created
-   [ ] New post appears in feed

### Comments

-   [ ] Can view comments on posts
-   [ ] Can add comments
-   [ ] Comments display correctly
-   [ ] Can interact with comments

### Profile

-   [ ] Profile loads correctly
-   [ ] User's posts display
-   [ ] Can edit profile
-   [ ] Profile picture updates work
-   [ ] Bio/description updates work

### Search

-   [ ] Can search for users
-   [ ] Can search for posts/stocks
-   [ ] Search results display correctly
-   [ ] Can navigate to search results

### Notifications

-   [ ] Notifications load (if implemented)
-   [ ] Notification interactions work

---

## ✅ 3. Content Moderation Features (Apple Requirement!)

### Report Post

-   [ ] Open any post
-   [ ] Tap three-dots menu (...)
-   [ ] "Report Post" option is visible
-   [ ] Tap "Report Post"
-   [ ] Report modal/screen appears
-   [ ] Can select report reason
-   [ ] Can submit report
-   [ ] Success message shown
-   [ ] Report is logged/sent to backend

### Report User

-   [ ] Open any user profile
-   [ ] Find report user option (three-dots menu or similar)
-   [ ] Tap "Report User"
-   [ ] Report modal appears
-   [ ] Can select report reason
-   [ ] Can submit report
-   [ ] Success message shown

### Block User

-   [ ] Open any user profile
-   [ ] Find block option (settings/three-dots menu)
-   [ ] Tap "Block User"
-   [ ] Confirmation dialog appears
-   [ ] Confirm block
-   [ ] User is blocked
-   [ ] Blocked user's content no longer visible
-   [ ] Can view blocked users list in settings
-   [ ] Can unblock user from blocked list

### EULA Acceptance

-   [ ] Fresh install or cleared app data
-   [ ] Login for first time
-   [ ] EULA modal appears after authentication
-   [ ] EULA text is readable
-   [ ] Can scroll through EULA
-   [ ] "Accept" button visible and works
-   [ ] After accepting, proceeds to app
-   [ ] EULA doesn't show again for same user

---

## ✅ 4. Privacy & Legal Requirements

### Privacy Policy

-   [ ] On login screen, tap "T&C, Privacy Policy" link
-   [ ] Safari/WebView opens `https://wagmee.in/privacy.html`
-   [ ] Privacy policy loads correctly
-   [ ] Content is readable
-   [ ] All required disclosures present:
    -   [ ] Data collection practices
    -   [ ] User rights
    -   [ ] Contact information

### App Store Listing

-   [ ] Privacy policy URL in App Store Connect matches working link
-   [ ] App description accurately describes functionality
-   [ ] Screenshots are up-to-date
-   [ ] No misleading claims

---

## ✅ 5. Technical Requirements

### Performance

-   [ ] App launches within 3 seconds
-   [ ] No noticeable lag or freezing
-   [ ] Smooth animations
-   [ ] Images load efficiently
-   [ ] No memory leaks during normal use

### Stability

-   [ ] No crashes during 15 minutes of normal use
-   [ ] No crashes during authentication flow
-   [ ] No crashes when switching between tabs
-   [ ] No crashes when app goes to background and returns
-   [ ] Handles low memory situations gracefully

### iOS Compatibility

-   [ ] Test on iOS 14 (or your minimum supported version)
-   [ ] Test on iOS 15
-   [ ] Test on iOS 16
-   [ ] Test on iOS 17 (latest)
-   [ ] Test on different device sizes:
    -   [ ] iPhone SE (small screen)
    -   [ ] iPhone 14/15 (standard)
    -   [ ] iPhone 14/15 Pro Max (large screen)
    -   [ ] iPad (if supported)

### Deep Linking

-   [ ] `tradetribe://redirect?code=test` opens app correctly
-   [ ] App handles malformed deep links gracefully
-   [ ] No crashes from unexpected deep link params

---

## ✅ 6. App Store Metadata

### App Information

-   [ ] App name: "Wagmee Club" or "TradeTribe" (verify)
-   [ ] Subtitle/tagline (if any) is accurate
-   [ ] Bundle ID: `com.trade.tribe` (matches Xcode)
-   [ ] Version: `1.0.0` (matches app.json)
-   [ ] Build number is incremented

### Description

-   [ ] App description is compelling
-   [ ] Mentions key features
-   [ ] No prohibited content or keywords
-   [ ] Grammar and spelling checked

### Screenshots

-   [ ] At least 3 screenshots
-   [ ] Show key features (login, feed, profile, etc.)
-   [ ] Correct dimensions for App Store
-   [ ] Look professional
-   [ ] Updated to current UI

### Keywords

-   [ ] Relevant keywords selected
-   [ ] No trademarked terms without permission
-   [ ] Not spammy

### Categories

-   [ ] Primary category selected (Social Networking or Finance?)
-   [ ] Secondary category (if applicable)

### Age Rating

-   [ ] Correctly set based on content
-   [ ] User-generated content flag enabled
-   [ ] Content moderation features noted

---

## ✅ 7. Build & Submission

### Xcode Build

-   [ ] Archive builds successfully
-   [ ] No build warnings (or only acceptable ones)
-   [ ] Code signing configured correctly
-   [ ] Provisioning profile valid
-   [ ] Bundle identifier correct: `com.trade.tribe`

### App Store Connect

-   [ ] Build uploaded successfully
-   [ ] Build processing complete
-   [ ] Build selected for version
-   [ ] All required metadata filled
-   [ ] Export compliance set to "No" (unless you have encryption)
-   [ ] Review notes provided (if needed)

### TestFlight (Optional but Recommended)

-   [ ] Upload to TestFlight first
-   [ ] Internal testing completed
-   [ ] All critical features tested
-   [ ] No major issues found
-   [ ] Ready to submit for review

---

## ✅ 8. Documentation Prepared

### For Apple Review Team

-   [ ] `APPLE_REVIEW_AUTH_RESPONSE.md` ready (in case of rejection)
-   [ ] Demo account credentials prepared (if required)
-   [ ] Review notes mention content moderation features
-   [ ] Screenshots show EULA, report, and block features

### For Your Team

-   [ ] `AUTH_SETUP_COMPLETE.md` documents authentication
-   [ ] `APPLE_APPROVAL_ANALYSIS.md` explains approval strategy
-   [ ] This checklist completed and verified

---

## ✅ 9. Final Verification

### Console Logs During Auth

Run the app with console open and verify clean logs:

```
✅ Expected logs:
🌐 Opening Auth0 login with Linking...
Auth URL: https://auth0.wagmee.in/authorize?...
✅ External browser opened successfully
🔄 Redirect page loaded with params: { code: '...' }
🔑 Authorization code found, getting JWT token...

❌ No errors like:
- Auth0 configuration errors
- Network timeout errors
- Redirect failures
- Unhandled promise rejections
```

### Authentication URL Verification

Check the auth URL in console includes:

-   [ ] `https://auth0.wagmee.in/authorize` ✅
-   [ ] `client_id=sQhMHMtJ2ja30w3nMiKA4yTyN2m8CkbR` ✅
-   [ ] `redirect_uri=tradetribe://redirect` (NOT encoded) ✅
-   [ ] `prompt=login` (forces fresh login) ✅

---

## ✅ 10. Risk Assessment

### Show-Stopper Issues (Must Fix Before Submission)

-   [ ] Authentication doesn't work
-   [ ] App crashes on launch
-   [ ] Can't create posts
-   [ ] Missing content moderation features
-   [ ] Privacy policy link broken
-   [ ] EULA doesn't display

### High Priority Issues (Should Fix)

-   [ ] Slow performance
-   [ ] UI glitches
-   [ ] Minor crashes in specific flows
-   [ ] Inconsistent behavior

### Medium Priority Issues (Can Fix Later)

-   [ ] Minor UI improvements
-   [ ] Feature enhancements
-   [ ] Nice-to-have features

### Current Status

Based on testing above, current risk level is:

-   [ ] 🟢 Low - Ready to submit!
-   [ ] 🟡 Medium - Fix a few things first
-   [ ] 🔴 High - Significant issues need addressing

---

## 📊 Submission Decision Matrix

### ✅ Ready to Submit If:

-   All "Show-Stopper" issues resolved ✅
-   Authentication working perfectly ✅
-   Content moderation features present ✅
-   Privacy policy accessible ✅
-   No critical crashes ✅
-   Acceptable performance ✅

### ⚠️ Not Ready Yet If:

-   Authentication flow broken
-   Missing required features
-   Frequent crashes
-   Privacy policy missing/broken
-   No content moderation

---

## 🚀 Final Steps Before Submission

1. **Complete Full Testing Pass**

    - Run through entire checklist above
    - Document any issues found
    - Fix critical issues

2. **Build Archive**

    ```bash
    # From project root
    cd ios
    pod install
    cd ..
    # Build in Xcode (Product → Archive)
    ```

3. **Upload to App Store Connect**

    - Use Xcode Organizer
    - Wait for processing (10-30 minutes)

4. **Fill App Store Metadata**

    - App Information
    - Screenshots
    - Description
    - Keywords
    - Privacy details

5. **Submit for Review**

    - Click "Submit for Review"
    - Answer questionnaire
    - Wait for review (2-4 days typically)

6. **Monitor Status**
    - Check App Store Connect daily
    - Be ready to respond within 24 hours if questions
    - Have `APPLE_REVIEW_AUTH_RESPONSE.md` ready

---

## ✅ Post-Submission

### While Waiting for Review

-   [ ] Monitor App Store Connect for status changes
-   [ ] Check email for messages from Apple
-   [ ] Prepare response if rejected (use APPLE_REVIEW_AUTH_RESPONSE.md)
-   [ ] Keep TestFlight build available for demo if requested

### If Approved 🎉

-   [ ] Celebrate!
-   [ ] Monitor user reviews
-   [ ] Be ready for bug reports
-   [ ] Plan next update

### If Rejected

-   [ ] Read rejection reason carefully
-   [ ] Check which guideline was cited
-   [ ] Use appropriate response from documentation
-   [ ] Respond within 48 hours
-   [ ] Be professional and technical in response

---

## 📞 Emergency Contacts

If you encounter issues:

-   **Auth0 Support:** Check Auth0 dashboard
-   **Apple Developer Support:** developer.apple.com/support
-   **Expo Support:** expo.dev/support (if using Expo features)

---

## ✨ You're Ready!

If you can check most boxes above (especially critical ones), you're ready to submit!

**Good luck with your submission! 🚀**

---

**Date Completed:** ******\_\_\_******
**Completed By:** ******\_\_\_******
**Issues Found:** ******\_\_\_******
**Ready to Submit:** [ ] Yes [ ] No
