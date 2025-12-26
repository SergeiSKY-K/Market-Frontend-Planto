import axiosInstance from "./axiosInstance";
export type { AppRole, AppUser } from "./user";


export const getAllUsers = async () =>
    (await axiosInstance.get("/users")).data;


export const addRole = async (login: string, role: string) =>
    (await axiosInstance.put(
        `/users/user/${encodeURIComponent(login)}/role/${encodeURIComponent(role)}`
    )).data;

export const removeRole = async (login: string, role: string) =>
    (await axiosInstance.delete(
        `/users/user/${encodeURIComponent(login)}/role/${encodeURIComponent(role)}`
    )).data;


export const deleteUser = async (login: string) =>
    (await axiosInstance.delete(`/users/user/${encodeURIComponent(login)}`)).data;


export const getSuppliers = async () =>
    (await axiosInstance.get(`/users/suppliers`)).data;

export const grantSupplier = async (login: string) =>
    addRole(login, "SUPPLIER");

export const revokeSupplier = async (login: string) =>
    removeRole(login, "SUPPLIER");
