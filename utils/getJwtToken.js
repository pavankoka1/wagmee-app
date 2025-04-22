import JWT from "expo-jwt";

function getJwtToken() {
    const header = {
        alg: "HS256",
        typ: "JWT",
    };

    const payload = {
        guest: "true",
    };

    console.log(process.env.EXPO_PUBLIC_SMALLCASE_PRIVATEKEY);

    // Use the encode function from expo-jwt to create the token
    const token = JWT.encode(
        payload,
        process.env.EXPO_PUBLIC_SMALLCASE_PRIVATEKEY, // Ensure this is set correctly in your environment
        {
            algorithm: "HS256",
            header: header,
        }
    );

    return token;
}

export default getJwtToken;
