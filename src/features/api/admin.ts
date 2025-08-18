import axiosInstance from "./axiosInstance";
export type { AppRole, AppUser } from "./user"; // используем те же типы

/** Пользователи целиком (для админки) */
export const getAllUsers = async () =>
    (await axiosInstance.get("/users")).data;

/** Роли */
export const addRole = async (login: string, role: string) =>
    (await axiosInstance.put(
        `/users/user/${encodeURIComponent(login)}/role/${encodeURIComponent(role)}`
    )).data;

export const removeRole = async (login: string, role: string) =>
    (await axiosInstance.delete(
        `/users/user/${encodeURIComponent(login)}/role/${encodeURIComponent(role)}`
    )).data;

/** Удаление пользователя */
export const deleteUser = async (login: string) =>
    (await axiosInstance.delete(`/users/user/${encodeURIComponent(login)}`)).data;

/** Работа с поставщиками */
export const getSuppliers = async () =>
    (await axiosInstance.get(`/users/suppliers`)).data;

export const grantSupplier = async (login: string) =>
    addRole(login, "SUPPLIER");

export const revokeSupplier = async (login: string) =>
    removeRole(login, "SUPPLIER");
