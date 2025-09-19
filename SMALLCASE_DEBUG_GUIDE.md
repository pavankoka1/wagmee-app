# SmallCase Integration Debug Guide

## Issues Fixed

### 1. **Missing `userId` Variable** ✅

-   **Problem**: The `startTransaction` function was trying to use `userId` but it wasn't defined
-   **Fix**: Added code to fetch `userId` from SecureStore using `HEADERS_KEYS.USER_ID`

### 2. **Missing Import** ✅

-   **Problem**: `replacePlaceholders` function wasn't imported
-   **Fix**: Added the import statement

### 3. **Poor Error Handling** ✅

-   **Problem**: Errors were not properly logged or displayed
-   **Fix**: Added comprehensive error logging and user-friendly error messages

### 4. **No Debug Information** ✅

-   **Problem**: No way to see what's happening during the process
-   **Fix**: Added debug info display and console logging

## How to Debug

### 1. **Check Console Logs**

Open your React Native debugger or Metro bundler console to see detailed logs:

-   SDK configuration steps
-   JWT token validation
-   Transaction ID retrieval
-   Transaction response details
-   User ID retrieval
-   Holdings API calls

### 2. **Check Debug Info on Screen**

The component now shows real-time debug information:

-   Current step being executed
-   Error messages with details
-   Transaction state (idle, processing, success, error)

### 3. **Common Issues to Check**

#### A. **JWT Token Issues**

```javascript
// Check if JWT token is valid
const jwtToken = getJwtToken();
console.log("JWT Token:", jwtToken);
```

#### B. **User ID Not Found**

```javascript
// Check if USER_ID is stored in SecureStore
const userId = await SecureStore.getItemAsync(HEADERS_KEYS.USER_ID);
console.log("User ID:", userId);
```

#### C. **Transaction ID Issues**

```javascript
// Check if transaction ID is received
const res = await network.get(API_PATHS.getSmallcaseTransactionId);
console.log("Transaction ID:", res.transactionId);
```

#### D. **SmallCase Auth Token Issues**

```javascript
// Check if auth token is received from SmallCase
const smallcaseAuthToken = JSON.parse(txnResponse.data).smallcaseAuthToken;
console.log("SmallCase Auth Token:", smallcaseAuthToken);
```

## Testing Steps

1. **Clear Existing Token** (if needed):

    ```javascript
    await SecureStore.deleteItemAsync(HEADERS_KEYS.SMALLCASE_AUTH_TOKEN);
    ```

2. **Test Fresh Flow**:

    - Open the SmallCase integration
    - Watch the debug info on screen
    - Check console logs for detailed information
    - Follow the step-by-step process

3. **Test Error Scenarios**:
    - Try with invalid JWT token
    - Try with missing user ID
    - Try with network issues

## Expected Flow

1. **Check for existing token** → If found, skip to step 6
2. **Configure SDK** → Set environment and gateway settings
3. **Initialize session** → Use JWT token to initialize
4. **Get transaction ID** → Call your backend API
5. **Start transaction** → Trigger SmallCase transaction
6. **Process response** → Get auth token from SmallCase
7. **Fetch holdings** → Call your backend with auth token
8. **Store token** → Save for future use
9. **Success** → Call onSuccess callback

## Troubleshooting

### If stuck on "Processing transaction..."

-   Check if SmallCase SDK is properly configured
-   Verify transaction ID is valid
-   Check network connectivity
-   Look for error messages in console

### If getting "User ID not found"

-   Ensure user is logged in
-   Check if USER_ID is stored in SecureStore
-   Verify HEADERS_KEYS.USER_ID constant

### If transaction fails

-   Check SmallCase SDK logs
-   Verify JWT token is valid and not expired
-   Check if your backend API is working
-   Verify SmallCase configuration (environment, gateway name, etc.)

## Additional Debugging

Add this to your component to get more detailed information:

```javascript
// Add this to see all stored values
const debugStoredValues = async () => {
    const userId = await SecureStore.getItemAsync(HEADERS_KEYS.USER_ID);
    const jwtToken = getJwtToken();
    const smallcaseToken = await SecureStore.getItemAsync(
        HEADERS_KEYS.SMALLCASE_AUTH_TOKEN
    );

    console.log("Debug Values:", {
        userId,
        jwtToken: jwtToken ? "Present" : "Missing",
        smallcaseToken: smallcaseToken ? "Present" : "Missing",
    });
};
```
