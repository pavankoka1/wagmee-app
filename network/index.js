import generateRandomString from "@/utils/generateRandomString";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { ToastAndroid } from "react-native";
import { router } from "expo-router";

const axiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_DOMAIN,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // if (config.url.includes("/small-case/user/1/holdings")) {
            //     config.headers.Authorization = "localo";
            // }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        if (error.response) {
            console.log(error.response);
            switch (error.response.status) {
                case 401:
                    console.log("Unauthorized: Clearing token and redirecting");
                    // Clear the token
                    await SecureStore.deleteItemAsync("token");
                    ToastAndroid.showWithGravityAndOffset(
                        "Unauthorized: Please log in again.",
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        25,
                        50
                    );
                    // Redirect to login page
                    router.replace("/redirect?refresh=true");
                    break;
                case 403:
                    ToastAndroid.showWithGravityAndOffset(
                        "Forbidden: You do not have permission to access this resource.",
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        25,
                        50
                    );
                    // Redirect to login page for 403 as well
                    router.replace("/redirect?refresh=true");
                    break;
                case 404:
                    ToastAndroid.showWithGravityAndOffset(
                        "Not Found: The requested resource does not exist.",
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        25,
                        50
                    );
                    break;
                case 500:
                    // ToastAndroid.showWithGravityAndOffset(
                    //     "Server Error: Something went wrong on the server.",
                    //     ToastAndroid.LONG,
                    //     ToastAndroid.TOP,
                    //     25,
                    //     50
                    // );
                    break;
                default:
                    ToastAndroid.showWithGravityAndOffset(
                        "An error occurred: " + error.message,
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        25,
                        50
                    );
            }
        } else if (error.request) {
            ToastAndroid.showWithGravityAndOffset(
                "No response received: " + error.message || "unknown error",
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                25,
                50
            );
        } else {
            ToastAndroid.showWithGravityAndOffset(
                "Request setup error: " + error.message,
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                25,
                50
            );
        }
        return Promise.reject(error);
    }
);

// Function to set a new base URL
const setBaseURL = (newBaseURL) => {
    axiosInstance.defaults.baseURL = newBaseURL;
};

const network = {
    get: async (url, params = {}) => {
        try {
            const response = await axiosInstance.get(url, { params });
            return response;
        } catch (error) {
            throw error;
        }
    },
    post: async (url, data) => {
        try {
            const response = await axiosInstance.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    put: async (url, data) => {
        try {
            const response = await axiosInstance.put(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    delete: async (url) => {
        try {
            const response = await axiosInstance.delete(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    uploadFile: async (url, file, userId) => {
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("media", {
            uri: file.uri,
            type: file.type || "image/jpeg",
            name: generateRandomString(16),
        });
        try {
            const response = await axiosInstance.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response;
        } catch (error) {
            throw error;
        }
    },
    setBaseURL, // Expose the method to set a new base URL
};

export default network;
