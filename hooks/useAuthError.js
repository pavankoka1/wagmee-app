import { useRouter } from "expo-router";
import { useCallback } from "react";

const useAuthError = () => {
    const router = useRouter();

    const handleAuthError = useCallback(
        (error) => {
            if (error?.response?.status === 401) {
                // Redirect to login/redirect page
                router.replace("/redirect?refresh=true");
            }
        },
        [router]
    );

    return { handleAuthError };
};

export default useAuthError;
