import axios from "axios";
import { store } from "../../store/store.ts";

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

export default axiosInstance;