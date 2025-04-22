import { SafeAreaProvider } from "react-native-safe-area-context";
import * as AuthSession from "expo-auth-session";
import {
    RefreshTokenRequestConfig,
    TokenResponse,
    TokenResponseConfig,
} from "expo-auth-session";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { Alert, Platform, Text, TouchableOpacity } from "react-native";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import { Linking } from "react-native";
import LoginScreen from "@/components/auth/Login";
import * as Application from "expo-application";

// const auth0ClientId = "ymxrDW8vonxYWOvUW2tpu8OWTcfAeuDb";
// const domain = "dev-g2l6apgl7oskgwot.us.auth0.com";
const domain = process.env.EXPO_PUBLIC_CLERK_AUTH0_DOMAIN;
const auth0ClientId = process.env.EXPO_PUBLIC_CLERK_AUTH0_CLIENT_ID;
const authorizationEndpoint = `https://${domain}/authorize`;
const tokenEndpoint = `https://${domain}/oauth/token`;
const useProxy = Platform.select({ web: false, default: true });
// const redirectUri = "tradetribe://redirect";
const redirectUri = "https://webhook-test.com/9df4de80788506c23da90fe790d8d55b";

WebBrowser.maybeCompleteAuthSession();

const generateCodeVerifier = async () => {
    const randomBytes = await generateRandomBytes(32);
    return randomBytes.toString("base64url");
};

const generateCodeChallenge = (codeVerifier) => {
    return createHash("sha256").update(codeVerifier).digest("base64url");
};

const codeVerifier = await generateCodeVerifier();
const codeChallenge = generateCodeChallenge(codeVerifier);

export default function App() {
    const [user, setUser] = useState({});
    const [code, setCode] = useState("");

    const { getItem: getCachedToken, setItem: setToken } =
        useAsyncStorage("jwtToken");

    console.log({ codeChallenge, codeVerifier });

    const [request, result, promptAsync] = AuthSession.useAuthRequest(
        {
            redirectUri: redirectUri,
            clientId: auth0ClientId,
            scopes: ["openid", "profile", "offline_access"],
            codeChallenge,
            codeChallengeMethod: "S256",
        },
        { authorizationEndpoint }
    );

    const readTokenFromStorage = async () => {
        // get the cached token config
        const tokenString = await getCachedToken();
        const tokenConfig: TokenResponseConfig = JSON.parse(tokenString);
        if (tokenConfig) {
            // instantiate a new token response object which will allow us to refresh
            let tokenResponse = new TokenResponse(tokenConfig);

            // shouldRefresh checks the expiration and makes sure there is a refresh token
            if (tokenResponse.shouldRefresh()) {
                // All we need here is the clientID and refreshToken because the function handles setting our grant type based on
                // the type of request configuration (refreshtokenrequestconfig in our example)
                const refreshConfig: RefreshTokenRequestConfig = {
                    clientId: auth0ClientId,
                    refreshToken: tokenConfig.refreshToken,
                };
                const endpointConfig = { tokenEndpoint };

                // pass our refresh token and get a new access token and new refresh token
                tokenResponse = await tokenResponse.refreshAsync(
                    refreshConfig,
                    endpointConfig
                );
            }
            // cache the token for next time
            setToken(JSON.stringify(tokenResponse.getRequestConfig()));

            // decode the jwt for getting profile information
            const decoded = jwtDecode(tokenResponse.accessToken);
            // storing token in state
            setUser({ jwtToken: tokenResponse.accessToken, decoded });
        }
    };

    useEffect(() => {
        // Handle the initial URL if the app is opened via a deep link
        const handleInitialUrl = async () => {
            const initialUrl = await Linking.getInitialURL();
            if (initialUrl) {
                handleDeepLink(initialUrl);
            }
        };

        // Listener for URL changes while the app is open
        const handleDeepLink = (url) => {
            const parsedUrl = new URL(url);
            const scheme = parsedUrl.protocol.replace(":", ""); // e.g., your_scheme
            const host = parsedUrl.hostname; // e.g., your_host
            const path = parsedUrl.pathname; // e.g., /redirect_path
            const params = Object.fromEntries(parsedUrl.searchParams); // query params as an object
            setCode(params.code);

            // alert("Deep Link Received", params.code, params.state);

            console.log(
                "params after refetch",
                params,
                host,
                path,
                scheme,
                parsedUrl
            );

            // Add your navigation or logic here
        };

        // Subscribe to deep linking events
        const subscription = Linking.addEventListener("url", (event) => {
            handleDeepLink(event.url);
        });

        handleInitialUrl();

        // Cleanup the event listener on unmount
        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        // read the refresh token from cache if we have one
        readTokenFromStorage();

        // boilerplate for promptasync example from expo
        if (result) {
            if (result.error) {
                Alert.alert(
                    "Authentication error",
                    result.params.error_description || "something went wrong"
                );
                return;
            }
            if (result.type === "success") {
                // we are using auth code flow, so get the response auth code
                const code = result.params.code;
                if (code) {
                    // function for retrieving the access token and refresh token from our code
                    const getToken = async () => {
                        const codeRes: TokenResponse =
                            await AuthSession.exchangeCodeAsync(
                                {
                                    code,
                                    redirectUri,
                                    clientId: auth0ClientId,
                                    extraParams: {
                                        code_verifier: request?.codeVerifier,
                                    },
                                },
                                { tokenEndpoint }
                            );
                        // get the config from our response to cache for later refresh
                        const tokenConfig: TokenResponseConfig =
                            codeRes?.getRequestConfig();

                        // get the access token to use
                        const jwtToken = tokenConfig.accessToken;

                        // caching the token for later
                        setToken(JSON.stringify(tokenConfig));

                        // decoding the token for getting user profile information
                        const decoded = jwtDecode(jwtToken);
                        setUser({ jwtToken, decoded });
                    };
                    getToken();
                }
            }
        }
    }, [result]);

    return (
        <LoginScreen
            onLoginPress={() => promptAsync({ useProxy })}
            code={code}
        />
    );

    return (
        <SafeAreaProvider>
            <TouchableOpacity onPress={() => promptAsync({ useProxy })}>
                <Text>Prompt</Text>
            </TouchableOpacity>
        </SafeAreaProvider>
    );
}
