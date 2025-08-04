import axiosInstance from "../api/axiosInstance.ts";
import { clearAccessToken } from "../../store/tokenSlice";
import { clearUser } from "../../store/userSlice";
import type { AppDispatch } from "../../store/store";

export const logout = async (dispatch: AppDispatch, login: string) => {
    try {
        await axiosInstance.post(`/auth/logout`, null, {
            params: { login },
        });

        dispatch(clearAccessToken());
        dispatch(clearUser());
    } catch (error) {
        console.error("Logout failed:", error);
        dispatch(clearAccessToken());
        dispatch(clearUser());
    }
};