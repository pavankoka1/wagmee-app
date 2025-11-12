import EmailAuthSheet from "@/components/auth/EmailAuthSheet";
import LoginFooter from "@/components/auth/LoginFooter";
import LoginHeader from "@/components/auth/LoginHeader";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import network from "@/network";
import API_PATHS from "@/network/apis";
import { HEADERS_KEYS } from "@/network/constants";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { Alert } from "react-native";

// This ensures the browser closes automatically after redirect
WebBrowser.maybeCompleteAuthSession();

const LoginContent = ({ onLoginPress, code, codeVerifier }) => {
    // State for username/password login
    const [isSignUp, setIsSignUp] = useState(false);
    const [isEmailSheetOpen, setIsEmailSheetOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Auth0 configuration
    const AUTH0_DOMAIN = "auth0.wagmee.in";
    const AUTH0_CLIENT_ID = "sQhMHMtJ2ja30w3nMiKA4yTyN2m8CkbR";
    const redirectUri = "tradetribe://redirect";

    // Handle authentication success
    const onAuthSuccess = async (res) => {
        const token = res.token;
        const refreshToken = res.refreshToken;
        const userId = res.id ? res.id.toString() : res.userId.toString();

        await SecureStore.setItemAsync(HEADERS_KEYS.TOKEN, token);
        await SecureStore.setItemAsync(
            HEADERS_KEYS.REFRESH_TOKEN,
            refreshToken
        );
        await SecureStore.setItemAsync(HEADERS_KEYS.USER_ID, userId);

        // Store additional user data needed for SmallCase JWT
        if (res.email) {
            await SecureStore.setItemAsync("user_email", res.email);
        }
        if (res.name) {
            await SecureStore.setItemAsync("user_name", res.name);
        }

        console.log("User authentication data stored:", {
            userId,
            email: res.email,
            name: res.name,
        });

        if (res.showOnboardingFlow) {
            router.replace("/onboarding");
        } else {
            router.replace("/(auth)/home");
        }
    };

    // Handle authentication failure
    const onAuthFailure = async (err) => {
        console.error("Authentication failed:", err);
        Alert.alert(
            "Login Failed",
            err?.response?.data?.message ||
                err?.message ||
                "Invalid credentials. Please try again."
        );
        setIsLoading(false);
    };

    // Helper function to safely extract error messages
    const extractErrorMessage = (error) => {
        if (!error) return "An error occurred";

        // If it's already a string, return it
        if (typeof error === "string") {
            return error;
        }

        // If it's an Error object, check its message
        if (error instanceof Error) {
            const msg = error.message;
            // If message is "[object Object]", try to extract from the error itself
            if (msg === "[object Object]" || msg.includes("[object Object]")) {
                // Try to get the actual error data
                if (error.response?.data) {
                    return extractErrorMessage(error.response.data);
                }
                // Try to stringify the error object
                try {
                    const str = JSON.stringify(error);
                    if (str !== "{}") return str;
                } catch (e) {
                    // Ignore
                }
            }
            return msg || "An error occurred";
        }

        // If it's an object, try to extract message fields
        if (typeof error === "object") {
            // Auth0 errors: message is usually a string, description can be an object
            // Priority: message > policy > error_description > description (if string)

            // 1. Check message first (Auth0 uses this for main error message)
            if (error.message && typeof error.message === "string") {
                return error.message;
            }

            // 2. Check policy (Auth0 password policy description)
            if (error.policy && typeof error.policy === "string") {
                return error.policy;
            }

            // 3. Check error_description (OAuth error format)
            if (
                error.error_description &&
                typeof error.error_description === "string"
            ) {
                return error.error_description;
            }

            // 4. Check description (only if it's a string, not an object)
            if (error.description && typeof error.description === "string") {
                return error.description;
            }

            // 5. If description is an object (like Auth0 password rules), use message or policy
            if (error.description && typeof error.description === "object") {
                if (error.message && typeof error.message === "string") {
                    return error.message;
                }
                if (error.policy && typeof error.policy === "string") {
                    return error.policy;
                }
            }

            // 6. Check error field
            if (error.error) {
                const err = error.error;
                if (typeof err === "string") return err;
                if (typeof err === "object") {
                    return extractErrorMessage(err);
                }
            }

            // 7. Check code with message
            if (error.code) {
                if (error.message && typeof error.message === "string") {
                    return `${error.message} (${error.code})`;
                }
                return `Error ${error.code}`;
            }

            // Last resort: try to stringify the object
            try {
                const str = JSON.stringify(error);
                if (str !== "{}" && str !== "null") {
                    return str;
                }
            } catch (e) {
                // Ignore
            }
        }

        return "An error occurred. Please try again.";
    };

    // Sign up using Auth0 Database Connection API
    const handleSignUp = async () => {
        if (!email.trim() || !password.trim() || !name.trim()) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (password.length < 8) {
            Alert.alert("Error", "Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);

        try {
            // Call Auth0 signup API
            const response = await fetch(
                `https://${AUTH0_DOMAIN}/dbconnections/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        client_id: AUTH0_CLIENT_ID,
                        email: email.trim(),
                        password: password,
                        name: name.trim(),
                        connection: "Username-Password-Authentication",
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                // Extract error message safely
                const errorMessage = extractErrorMessage(data);
                throw new Error(errorMessage);
            }

            // After successful signup, automatically sign in
            // Don't show alert here - just sign in silently
            await handleSignIn();
        } catch (err) {
            // Extract error message safely
            const errorMessage = extractErrorMessage(err);

            // Ensure we never show "[object Object]"
            let userMessage = errorMessage.includes("[object Object]")
                ? "Sign up failed. Please check your information and try again."
                : errorMessage;

            // Handle specific signup errors
            if (
                errorMessage.includes("Password is too weak") ||
                errorMessage.includes("password strength")
            ) {
                userMessage =
                    "Password is too weak. Please use at least 8 characters with a mix of letters, numbers, and special characters.";
            } else if (
                errorMessage.includes("User already exists") ||
                errorMessage.includes("already registered")
            ) {
                userMessage =
                    "An account with this email already exists. Please sign in instead.";
            } else if (
                errorMessage.includes("Invalid email") ||
                errorMessage.includes("email format")
            ) {
                userMessage = "Please enter a valid email address.";
            }

            Alert.alert("Sign Up Failed", userMessage);
            setIsLoading(false);
        }
    };

    // Sign in using Auth0 Password Grant (no browser - pure in-app login)
    const handleSignIn = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }

        setIsLoading(true);

        try {
            // Call Auth0 Password Grant API directly (no browser)
            // Use password-realm grant type with realm parameter (required for Auth0)
            const requestBody = {
                grant_type: "http://auth0.com/oauth/grant-type/password-realm",
                client_id: AUTH0_CLIENT_ID,
                username: email.trim(),
                password: password,
                scope: "openid profile email",
                realm: "Username-Password-Authentication", // Use realm instead of connection
            };

            const response = await fetch(
                `https://${AUTH0_DOMAIN}/oauth/token`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                // Extract error message from Auth0 response
                const errorMessage = extractErrorMessage(data);

                // Handle specific errors - show user-friendly messages
                let userMessage = errorMessage;

                // invalid_grant usually means wrong credentials, but can also mean grant type not enabled
                // Check error_description first to determine the actual issue
                if (data.error === "invalid_grant") {
                    const errorDesc =
                        data.error_description || errorMessage || "";
                    // If error_description mentions credentials, it's a wrong password issue
                    if (
                        errorDesc.includes("Wrong email or password") ||
                        errorDesc.includes("Invalid user credentials") ||
                        errorDesc.includes("invalid_user_password") ||
                        errorDesc.toLowerCase().includes("wrong") ||
                        errorDesc.toLowerCase().includes("invalid") ||
                        errorDesc.toLowerCase().includes("credentials")
                    ) {
                        userMessage =
                            "Invalid email or password. Please check your credentials and try again.";
                    } else {
                        // Configuration error (grant type not enabled)
                        userMessage =
                            "Password login is not enabled. Please contact support or use social login.";
                    }
                } else if (
                    data.error === "unauthorized_client" ||
                    errorMessage.includes("not allowed") ||
                    errorMessage.includes("grant type")
                ) {
                    userMessage =
                        "Password login is not enabled. Please contact support or use social login.";
                } else if (
                    errorMessage.includes("connection") ||
                    errorMessage.includes("default connection")
                ) {
                    userMessage =
                        "Authentication service configuration error. Please try again or use social login.";
                } else if (
                    data.error === "invalid_user_password" ||
                    errorMessage.includes("Wrong email or password") ||
                    errorMessage.includes("Invalid user credentials")
                ) {
                    userMessage =
                        "Invalid email or password. Please check your credentials and try again.";
                } else if (
                    errorMessage.includes("too many attempts") ||
                    errorMessage.includes("rate limit")
                ) {
                    userMessage =
                        "Too many login attempts. Please try again in a few minutes.";
                } else {
                    // Use the actual error message from Auth0 if it's user-friendly
                    userMessage = errorMessage;
                }

                Alert.alert("Sign In Failed", userMessage);
                setIsLoading(false);
                return;
            }

            // Exchange Auth0 token with backend using the SAME format as redirect.jsx
            // redirect.jsx calls: { authorizationCode: code, redirectUrl: ... }
            // For password grant, we'll use the access_token as authorizationCode
            // This matches the exact format that redirect.jsx uses
            const backendResponse = await network.post(API_PATHS.getJwtToken, {
                accessToken: data.access_token,
                redirectUrl: process.env.EXPO_PUBLIC_API_REDIRECT,
            });

            await onAuthSuccess(backendResponse);
        } catch (err) {
            const errorMessage = extractErrorMessage(err);
            Alert.alert("Sign In Failed", errorMessage);
            setIsLoading(false);
        }
    };

    // Handle password login (sign in or sign up)
    const handlePasswordLogin = async () => {
        if (isSignUp) {
            await handleSignUp();
        } else {
            await handleSignIn();
        }
    };

    // OAuth login - using original Linking.openURL (as it was working before)
    const openAuthUrl = async (connection = null) => {
        const { authUrl, isFromLogout, promptValues } = await buildAuthUrl(
            connection
        );

        const prefersEphemeralSession =
            connection === "google-oauth2" || isFromLogout;
        const promptLog =
            promptValues.length > 0 ? promptValues.join(", ") : "none";

        console.log("🔗 Redirect URI:", redirectUri);
        console.log("🔗 Auth URL:", authUrl);
        console.log("🧭 Prompt values:", promptLog);
        console.log(
            "🕶️ Using ephemeral session?",
            prefersEphemeralSession ? "yes" : "no"
        );

        try {
            setIsLoading(true);

            const authResult = await WebBrowser.openAuthSessionAsync(
                authUrl,
                redirectUri,
                {
                    showInRecents: true,
                    prefersEphemeralSession,
                }
            );

            console.log("✅ Auth session finished with result:", authResult);

            if (authResult.type === "cancel" || authResult.type === "dismiss") {
                console.log("⚠️ User dismissed the authentication session.");
                return;
            }

            if (authResult.type === "locked") {
                console.log("🔒 Authentication session is locked.");
                Alert.alert(
                    "Authentication Unavailable",
                    "Another authentication session is currently active. Please try again."
                );
                return;
            }

            if (authResult.type === "success" && authResult.url) {
                const params = extractParamsFromUrl(authResult.url);

                if (params.error) {
                    console.error("Auth0 returned an error:", params);
                    const userMessage =
                        params.error_description ||
                        params.error ||
                        "Authentication failed. Please try again.";
                    Alert.alert("Sign In Failed", userMessage);
                    return;
                }

                if (params.logout === "true") {
                    console.log(
                        "🚪 Auth0 logout redirect detected, navigating to login."
                    );
                    router.replace("/");
                    return;
                }

                if (params.code) {
                    console.log(
                        "🔑 Authorization code received via in-app session."
                    );
                    router.replace(`/redirect?code=${params.code}`);
                    return;
                }

                console.log(
                    "ℹ️ Auth session completed without code or error params."
                );
            }
        } catch (err) {
            console.error("Auth error:", err);
            Alert.alert(
                "Error",
                "Failed to open authentication: " + err.message
            );
        } finally {
            setIsLoading(false);
        }
    };

    const buildAuthUrl = async (connection) => {
        const baseParams = new Map([
            ["response_type", "code"],
            ["client_id", AUTH0_CLIENT_ID],
            ["redirect_uri", redirectUri],
            ["scope", "openid profile email"],
        ]);

        const promptValues = new Set();

        // Check logout flag to force new login prompt and remove stale session
        const isFromLogout =
            (await SecureStore.getItemAsync("is_from_logout")) === "true";
        console.log("🔍 Checking logout flag:", isFromLogout);
        if (isFromLogout) {
            promptValues.add("login");
            await SecureStore.deleteItemAsync("is_from_logout");
            console.log(
                "🔄 Post-logout login detected, adding prompt=login and clearing flag"
            );
        } else {
            console.log("🔄 Normal login flow, no logout prompt required");
        }

        if (connection) {
            baseParams.set("connection", connection);
            console.log(`🔐 Opening Auth0 with ${connection} connection...`);
        } else {
            console.log("🌐 Opening Auth0 Universal Login...");
        }

        if (connection === "google-oauth2") {
            promptValues.add("select_account");
        }

        if (promptValues.size > 0) {
            baseParams.set(
                "prompt",
                Array.from(promptValues).filter(Boolean).join(" ")
            );
        }

        const queryString = Array.from(baseParams.entries())
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join("&");

        return {
            authUrl: `https://${AUTH0_DOMAIN}/authorize?${queryString}`,
            isFromLogout,
            promptValues: Array.from(promptValues),
        };
    };

    const extractParamsFromUrl = (url) => {
        if (!url || typeof url !== "string") {
            return {};
        }

        const queryIndex = url.indexOf("?");
        if (queryIndex === -1) {
            return {};
        }

        const queryString = url.substring(queryIndex + 1);
        const pairs = queryString.split("&");
        return pairs.reduce((acc, pair) => {
            const [rawKey, rawValue = ""] = pair.split("=");
            if (!rawKey) return acc;

            try {
                const key = decodeURIComponent(rawKey);
                const value = decodeURIComponent(rawValue);
                acc[key] = value;
            } catch (e) {
                acc[rawKey] = rawValue;
            }
            return acc;
        }, {});
    };

    return (
        <>
            <LoginHeader />
            <SocialLoginButtons
                onApplePress={() => openAuthUrl("apple")}
                onGooglePress={() => openAuthUrl("google-oauth2")}
                onFacebookPress={() => openAuthUrl("facebook")}
                onEmailPress={() => setIsEmailSheetOpen(true)}
                isLoading={isLoading}
            />
            <EmailAuthSheet
                isOpen={isEmailSheetOpen}
                onClose={() => {
                    setIsEmailSheetOpen(false);
                    setEmail("");
                    setPassword("");
                    setName("");
                }}
                isSignUp={isSignUp}
                setIsSignUp={setIsSignUp}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                name={name}
                setName={setName}
                isLoading={isLoading}
                onSubmit={handlePasswordLogin}
            />
            <LoginFooter />
        </>
    );
};

export default LoginContent;
