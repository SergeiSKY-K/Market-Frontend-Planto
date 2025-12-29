import axios from "axios";
import { store } from "../../store/store";
import { setAccessToken, clearAccessToken } from "../../store/tokenSlice";
import {clearUser} from "../../store/userSlice.ts";

const API = import.meta.env.VITE_BASE_API_URL || "";

const axiosInstance = axios.create({
    baseURL: API,
    withCredentials: true,
});


axiosInstance.interceptors.response.use(
    r => r,
    async error => {
        const original = error.config;
        const status = error?.response?.status;
        const url = original?.url ?? "";


        if (
            url.includes("/auth/login") ||
            url.includes("/auth/register") ||
            url.includes("/auth/refresh")
        ) {
            return Promise.reject(error);
        }

        if (status === 401 && !original._retry) {
            original._retry = true;

            try {
                const resp = await axios.post(
                    `${API}/auth/refresh`,
                    null,
                    { withCredentials: true }
                );

                const authHeader = resp.headers["authorization"];
                const newToken = authHeader?.split(" ")[1];

                if (newToken) {
                    store.dispatch(setAccessToken(newToken));
                    original.headers = original.headers ?? {};
                    original.headers.Authorization = `Bearer ${newToken}`;
                    return axiosInstance(original);
                }
            } catch (e) {
                store.dispatch(clearAccessToken());
                store.dispatch(clearUser());
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
