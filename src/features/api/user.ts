import axiosInstance from "./axiosInstance";

/** Роли и тип пользователя */
export type AppRole =
    | "ADMINISTRATOR"
    | "MODERATOR"
    | "SUPPLIER"
    | "CUSTOMER"
    | string;

export type AppUser = {
    login: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    roles?: AppRole[];
    createdAt?: string;
};

/** Self / общий */
export const getUserByLogin = async (login: string): Promise<AppUser> =>
    (await axiosInstance.get(`/users/user/${encodeURIComponent(login)}`)).data;

export const updateUserSelf = async (
    login: string,
    body: { firstName?: string; lastName?: string; roles?: string[] } // роли игнорятся на бэке для не-админа
): Promise<AppUser> =>
    (await axiosInstance.put(`/users/user/${encodeURIComponent(login)}`, body))
        .data;

export const changePassword = async (body: {
    oldPassword: string;
    newPassword: string;
}) => axiosInstance.put(`/users/password`, body); // 204

export const deleteUserSelf = async (login: string): Promise<void> => {
    await axiosInstance.delete(`/users/user/${encodeURIComponent(login)}`);
};
