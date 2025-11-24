import axios, { AxiosError } from "axios";
import type { ErrorResponse } from "@app/backend";

// Axios instance with common configurations (base URL, headers, etc.)
const axiosInstance = axios.create({
    baseURL: (import.meta.env.VITE_SERVER_URL || "http://localhost:4000") + "/v1",
    timeout: 15000,
    withCredentials: true,
});

// Intercepting responses to handle common error logic
axiosInstance.interceptors.response.use(
    (response) => {
        // You can perform any common response logic here
        return response;
    },
    (error: AxiosError<ErrorResponse>) => {
        const { response } = error;
        const err: ErrorResponse = {
            status: response?.status || 500,
            message: response?.data?.message || "Internal server error",
            extraDetails: response?.data?.extraDetails || "Something went wrong",
            errors: response?.data?.errors
        };

        console.error(err);
        return Promise.reject(err);
    },
);

export default axiosInstance;
