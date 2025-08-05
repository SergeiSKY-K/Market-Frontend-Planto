import axios from "axios";
import store from "../../store/store.ts";
import { setAccessToken } from "../../store/tokenSlice";


const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    withCredentials: true,
});


axiosInstance.interceptors.request.use((config) => {
    const token = store.getState().token.accessToken;
    if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});


axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;


        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;
            try {

                const refreshResponse = await axios.get(
                    `${import.meta.env.VITE_BASE_API_URL}/auth/refresh`,
                    { withCredentials: true }
                );

                const newAccessToken = refreshResponse.headers["authorization"]?.split(" ")[1];

                if (newAccessToken) {

                    store.dispatch(setAccessToken(newAccessToken));


                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;


                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
