import { SafeAreaProvider } from "react-native-safe-area-context";
import * as AuthSession from "expo-auth-session";
import { TokenResponse } from "expo-auth-session";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { Alert, Platform, Text, TouchableOpacity } from "react-native";
import AsyncStorage, {
    useAsyncStorage,
} from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import { Linking } from "react-native";
import LoginScreen from "@/components/auth/Login";
import { generateRandomBytes } from "expo-random";
import * as Crypto from "expo-crypto"; // Import expo-crypto
import { HEADERS_KEYS } from "@/network/constants";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

// Environment variables
const domain = process.env.EXPO_PUBLIC_CLERK_AUTH0_DOMAIN;
const auth0ClientId = process.env.EXPO_PUBLIC_CLERK_AUTH0_CLIENT_ID;
const authorizationEndpoint = `https://${domain}/authorize`;
const tokenEndpoint = `https://${domain}/oauth/token`;
const useProxy = Platform.select({ web: false, default: true });
const redirectUri = "tradetribe://redirect";
// const redirectUri = "https://webhook-test.com/f9acb33eea3aba14847c7a95eb99572c";

WebBrowser.maybeCompleteAuthSession();

const generateCodeVerifier = async () => {
    const randomBytes = await generateRandomBytes(64);
    return randomBytes.toString("base64url");
};

const generateCodeChallenge = async (codeVerifier) => {
    const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        codeVerifier,
        { encoding: Crypto.CryptoEncoding.BASE64URL }
    );
    return hash;
};

export default function App() {
    const [user, setUser] = useState({});
    const [code, setCode] = useState("");
    const { getItem: getCachedToken, setItem: setToken } =
        useAsyncStorage("jwtToken");

    const [codeVerifier, setCodeVerifier] = useState("");
    const [request, result, promptAsync] = AuthSession.useAuthRequest(
        {
            redirectUri,
            responseType: "code",
            clientId: auth0ClientId,
            scopes: ["openid", "profile", "email"],
            // codeChallenge: codeVerifier
            //     ? generateCodeChallenge(codeVerifier)
            //     : undefined,
            // codeChallenge: generateCodeChallenge(),
            // codeChallengeMethod: "S256",
        },
        { authorizationEndpoint }
    );

    useEffect(() => {
        const checkAuthToken = async () => {
            try {
                const token = await SecureStore.getItemAsync(
                    HEADERS_KEYS.TOKEN
                );
                console.log("Stored token:", token);

                if (token) {
                    router.replace("/redirect");
                }
            } catch (error) {
                console.error("Token check failed:", error);
            }
        };

        // Execute immediately but handle cleanup
        let isMounted = true;
        checkAuthToken();

        return () => {
            isMounted = false; // Prevent state updates on unmounted component
        };
    }, [router]);

    useEffect(() => {
        const handleDeepLink = (url) => {
            const parsedUrl = new URL(url);
            const params = Object.fromEntries(parsedUrl.searchParams);
            setCode(params.code);
        };

        const handleInitialUrl = async () => {
            const initialUrl = await Linking.getInitialURL();
            if (initialUrl) {
                handleDeepLink(initialUrl);
            }
        };

        const subscription = Linking.addEventListener("url", (event) => {
            handleDeepLink(event.url);
        });

        handleInitialUrl();

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            const verifier = await generateCodeVerifier();
            setCodeVerifier(verifier);
        };

        initializeAuth();
    }, []);

    useEffect(() => {
        if (result) {
            if (result.error) {
                Alert.alert(
                    "Authentication error",
                    result.params.error_description || "Something went wrong"
                );
                return;
            }
            if (result.type === "success") {
                const code = result.params.code;
                if (code) {
                    const getToken = async () => {
                        const codeRes = await AuthSession.exchangeCodeAsync(
                            {
                                code,
                                redirectUri,
                                clientId: auth0ClientId,
                                extraParams: {
                                    code_verifier: codeVerifier,
                                },
                            },
                            { tokenEndpoint }
                        );

                        const tokenConfig = codeRes?.getRequestConfig();
                        const jwtToken = tokenConfig.accessToken;

                        setToken(JSON.stringify(tokenConfig));
                        const decoded = jwtDecode(jwtToken);
                        setUser({ jwtToken, decoded });
                    };
                    getToken();
                }
            }
        }
    }, [result]);

    return (
        <SafeAreaProvider>
            <LoginScreen
                onLoginPress={() => promptAsync({ useProxy })}
                code={code}
                codeVerifier={codeVerifier}
            />
        </SafeAreaProvider>
    );
}
