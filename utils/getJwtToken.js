import { HEADERS_KEYS } from "@/network/constants";
import JWT from "expo-jwt";
import * as SecureStore from "expo-secure-store";

async function getJwtToken() {
    const header = {
        alg: "HS256",
        typ: "JWT",
    };

    // Get user data from SecureStore
    const userId = await SecureStore.getItemAsync(HEADERS_KEYS.USER_ID);
    const userEmail = await SecureStore.getItemAsync("user_email");
    const userName = await SecureStore.getItemAsync("user_name");

    if (!userId || !userEmail || !userName) {
        throw new Error(
            "User authentication required. Please log in to use SmallCase integration."
        );
    }

    const payload = {
        userId: parseInt(userId),
        email: userEmail,
        name: userName,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiry
        gatewayName: "wagmee",
    };

    console.log("Generating JWT for user:", {
        userId,
        email: userEmail,
        name: userName,
    });

    const token = JWT.encode(
        payload,
        process.env.EXPO_PUBLIC_SMALLCASE_PRIVATEKEY,
        {
            algorithm: "HS256",
            header: header,
        }
    );

    return token;
}

export default getJwtToken;
