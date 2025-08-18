// import axios from "axios";
// import store from "../../store/store.ts";
// import { setAccessToken } from "../../store/tokenSlice";
//
// const axiosInstance = axios.create({
//     baseURL: import.meta.env.VITE_BASE_API_URL,
//     withCredentials: true,
// });
//
// // подставляем accessToken
// axiosInstance.interceptors.request.use((config) => {
//     const token = store.getState().token.accessToken;
//     if (token && config.headers) {
//         config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
// });
//
// axiosInstance.interceptors.response.use(
//     (r) => r,
//     async (error) => {
//         const originalRequest: any = error.config;
//         const status = error?.response?.status;
//
//         // пробуем refresh ТОЛЬКО на 401 (просрочен access)
//         if (status === 401 && !originalRequest?._retry) {
//             originalRequest._retry = true;
//             try {
//                 const refreshResponse = await axios.post(
//                     `${import.meta.env.VITE_BASE_API_URL}/auth/refresh`,
//                     null,
//                     { withCredentials: true }
//                 );
//                 const authHeader = refreshResponse.headers["authorization"];
//                 const newAccessToken = authHeader?.split(" ")[1];
//
//                 if (newAccessToken) {
//                     store.dispatch(setAccessToken(newAccessToken));
//                     axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
//                     originalRequest.headers = originalRequest.headers || {};
//                     originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//                     return axiosInstance(originalRequest);
//                 }
//             } catch (e) {
//                 // рефреш не удался — отдадим ошибку наверх, пусть страница решает что делать
//             }
//         }
//
//         // 400/403 и прочие — пробрасываем как есть (без авто-разлогина)
//         return Promise.reject(error);
//     }
// );
//
// export default axiosInstance;

import axios from "axios";
import { store } from "../../store/store";
import { setAccessToken } from "../../store/tokenSlice";

const API = import.meta.env.VITE_BASE_API_URL || ""; // напр. "http://localhost:8880"

const axiosInstance = axios.create({
    baseURL: API,
    withCredentials: true,
});

// всегда подставляем актуальный access
axiosInstance.interceptors.request.use((config) => {
    const token = store.getState().token.accessToken;
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// авто-рефреш на 401/403 один раз и повтор запроса
axiosInstance.interceptors.response.use(
    (r) => r,
    async (error) => {
        const original: any = error?.config;
        const status = error?.response?.status;

        if ((status === 401 || status === 403) && !original?._retry) {
            original._retry = true;
            try {
                const resp = await axios.post(`${API}/auth/refresh`, null, {
                    withCredentials: true,
                });
                const authHeader = resp.headers["authorization"];
                const newToken = authHeader?.split(" ")[1];
                if (newToken) {
                    store.dispatch(setAccessToken(newToken));
                    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                    original.headers = original.headers ?? {};
                    original.headers["Authorization"] = `Bearer ${newToken}`;
                    return axiosInstance(original);
                }
            } catch {
                // провал рефреша — пробрасываем дальше
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
