import axiosInstance from "./axiosInstance";
import { setAccessToken } from "../../store/tokenSlice";
import { setUser } from "../../store/userSlice";
import type { AppDispatch } from "../../store/store";

interface LoginDto {
    username: string;
    password: string;
}

interface RegisterBody {
    login: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

export const login = async (credentials: LoginDto, dispatch: AppDispatch) => {
    const response = await axiosInstance.post("/auth/login", credentials);

    const accessToken = response.headers["authorization"]?.replace("Bearer ", "");
    if (!accessToken) throw new Error("Access token not found in response");

    dispatch(setAccessToken(accessToken));

    const userDto = response.data as { login: string; roles?: string[] };
    dispatch(setUser({ login: userDto.login, roles: userDto.roles || [] }));

    return userDto; // можно использовать дальше в UI
};

export const register = async (body: RegisterBody) => {
    // Бэк отдаёт UserDto без авторизации — логиниться после регистрации отдельно
    const { data } = await axiosInstance.post("/users/register", body);
    return data; // UserDto
};
