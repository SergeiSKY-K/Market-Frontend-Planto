import axiosInstance from "./axiosInstance";
import { setAccessToken } from "../../store/tokenSlice";
import { setUser } from "../../store/userSlice";
import type { AppDispatch } from "../../store/store";

interface LoginDto {
    username: string;
    password: string;
}

export const login = async (credentials: LoginDto, dispatch: AppDispatch) => {
    const response = await axiosInstance.post("/auth/login", credentials);

    const accessToken = response.headers["authorization"]?.replace("Bearer ", "");
    if (!accessToken) throw new Error("Access token not found in response");

    dispatch(setAccessToken(accessToken));

    const userDto = response.data; // { login: string, roles: string[] }
    dispatch(setUser({ login: userDto.login, roles: userDto.roles || [] }));

    return userDto;
};
