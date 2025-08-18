// src/features/api/logout.ts
import axiosInstance from "../api/axiosInstance";
import { clearAccessToken } from "../../store/tokenSlice";
import { clearUser } from "../../store/userSlice";
import type { AppDispatch } from "../../store/store";

export const logout = async (dispatch: AppDispatch, login?: string) => {
    try {
        // если login передали — отправим как раньше, нет — просто скипаем параметр
        await axiosInstance.post(
            `/auth/logout`,
            null,
            login ? { params: { login } } : undefined
        );
    } catch (e) {
        console.error("Logout failed (ignored):", e);
    } finally {
        dispatch(clearAccessToken());
        dispatch(clearUser());
    }
};