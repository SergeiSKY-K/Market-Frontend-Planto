import axiosInstance from "../api/axiosInstance";
import { clearAccessToken } from "../../store/tokenSlice";
import { clearUser } from "../../store/userSlice";
import type { AppDispatch } from "../../store/store";

export const logout = async (dispatch: AppDispatch) => {
    try {
        await axiosInstance.post("/auth/logout");
    } catch (e) {
        console.warn("Logout request failed (ignored)");
    } finally {
        dispatch(clearAccessToken());
        dispatch(clearUser());
    }
};
