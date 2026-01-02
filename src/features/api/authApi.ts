// import axiosInstance from "./axiosInstance";
// import { setAccessToken } from "../../store/tokenSlice";
// import { setUser } from "../../store/userSlice";
// import type { AppDispatch } from "../../store/store";
//
// interface LoginDto {
//     login: string;
//     password: string;
// }
//
// interface RegisterBody {
//     login: string;
//     password: string;
//     firstName?: string;
//     lastName?: string;
// }
//
// export const login = async (credentials: LoginDto, dispatch: AppDispatch) => {
//     const response = await axiosInstance.post("/auth/login", credentials);
//
//     const accessToken = response.headers["authorization"]?.replace("Bearer ", "");
//     if (!accessToken) throw new Error("Access token not found in response");
//
//     dispatch(setAccessToken(accessToken));
//
//     const userDto = response.data as { login: string; roles?: string[] };
//     dispatch(setUser({ login: userDto.login, roles: userDto.roles || [] }));
//
//     return userDto;
// };
//
// export const register = async (body: RegisterBody) => {
//     const { data } = await axiosInstance.post("/users/register", body);
//     return data; // UserDto
// };
import axiosInstance from "./axiosInstance";
import { setAccessToken } from "../../store/tokenSlice";
import { setUser } from "../../store/userSlice";
import type { AppDispatch } from "../../store/store";

interface LoginDto {
    login: string;
    password: string;
}

interface RegisterBody {
    login: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export const login = async (
    credentials: LoginDto,
    dispatch: AppDispatch
) => {
    let lastError: any;


    try {
        await axiosInstance.get("/health");
    } catch {}

    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            console.log(`🔐 Login attempt ${attempt}`);

            const response = await axiosInstance.post(
                "/auth/login",
                credentials,
                { withCredentials: true }
            );

            const authHeader = response.headers["authorization"];
            const accessToken = authHeader?.replace("Bearer ", "");

            if (!accessToken) {
                throw new Error("Access token not found in response");
            }

            dispatch(setAccessToken(accessToken));

            const userDto = response.data as {
                login: string;
                roles?: string[];
            };

            dispatch(
                setUser({
                    login: userDto.login,
                    roles: userDto.roles || [],
                })
            );

            return userDto;
        } catch (err: any) {
            lastError = err;
            const status = err?.response?.status;

            console.warn(
                `Login attempt ${attempt} failed`,
                status
            );


            if (status === 502 || !status) {
                await sleep(1200);
                continue;
            }


            throw err;
        }
    }

    throw lastError;
};

export const register = async (body: RegisterBody) => {
    const { data } = await axiosInstance.post(
        "/users/register",
        body,
        { withCredentials: true }
    );
    return data;
};
