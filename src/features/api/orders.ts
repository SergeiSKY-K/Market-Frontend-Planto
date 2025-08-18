import api from "./axiosInstance";
import type { CreateOrderDto, OrderResponseDto, Page } from "../../utils/types/orders";

export const createOrder = (dto: CreateOrderDto, token: string) =>
    api.post<OrderResponseDto>("/orders", dto, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.data);

export const payOrder = (id: string, token: string) =>
    api.post<OrderResponseDto>(`/orders/${id}/pay`, null, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.data);

export const getMyOrders = (token: string) =>
    api.get<OrderResponseDto[]>("/orders/my", { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.data);

export const getSupplierOrders = (token: string) =>
    api.get<OrderResponseDto[]>("/orders/supplier", { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.data);

export const getModeratorOrders = (
    token: string, page = 0, size = 20, sortBy = "createdAt", direction: "asc" | "desc" = "desc"
) =>
    api.get<Page<OrderResponseDto>>("/orders/moderator", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, size, sortBy, direction }
    }).then(r => r.data);
