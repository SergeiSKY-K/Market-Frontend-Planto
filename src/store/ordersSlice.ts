import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { CreateOrderDto, OrderResponseDto, Page } from "../utils/types/orders";
import {
    createOrder,
    getMyOrders,
    payOrder,
    getSupplierOrders,
    getModeratorOrders,
    deleteOrder
} from "../features/api/orders";
import type { RootState } from "./store";

const tokenSel = (s: RootState) => s.token.accessToken as string;

export const thunkCreateOrder = createAsyncThunk<OrderResponseDto, CreateOrderDto, { state: RootState }>(
    "orders/create", async (dto, { getState }) => createOrder(dto, tokenSel(getState()))
);

export const thunkPayOrder = createAsyncThunk<OrderResponseDto, string, { state: RootState }>(
    "orders/pay", async (id, { getState }) => payOrder(id, tokenSel(getState()))
);

export const thunkFetchMy = createAsyncThunk<OrderResponseDto[], void, { state: RootState }>(
    "orders/my", async (_ , { getState }) => getMyOrders(tokenSel(getState()))
);

export const thunkFetchSupplier = createAsyncThunk<OrderResponseDto[], void, { state: RootState }>(
    "orders/supplier", async (_ , { getState }) => getSupplierOrders(tokenSel(getState()))
);

export const thunkFetchModerator = createAsyncThunk<
    Page<OrderResponseDto>, { page?: number; size?: number; sortBy?: string; direction?: "asc" | "desc" }, { state: RootState }
>("orders/mod", async (q, { getState }) =>
    getModeratorOrders(tokenSel(getState()), q?.page, q?.size, q?.sortBy, q?.direction)
);

export const thunkDeleteOrder = createAsyncThunk<
    string,
    string,
    { state: RootState }
>(
    "orders/delete",
    async (orderId, { getState }) => {
        await deleteOrder(orderId, tokenSel(getState()));
        return orderId;
    }
);

type OrdersState = {
    my: OrderResponseDto[];
    supplier: OrderResponseDto[];
    mod: Page<OrderResponseDto> | null;
    loading: boolean;
    error?: string;
};

const initialState: OrdersState = { my: [], supplier: [], mod: null, loading: false };

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: b => {
        b.addCase(thunkCreateOrder.pending, s => { s.loading = true; })
            .addCase(thunkCreateOrder.fulfilled, (s, a) => { s.loading = false; s.my.unshift(a.payload); })
            .addCase(thunkCreateOrder.rejected, (s, a) => { s.loading = false; s.error = String(a.error.message || "Create failed"); });

        b.addCase(thunkPayOrder.fulfilled, (s, a) => {
            const i = s.my.findIndex(o => o.id === a.payload.id);
            if (i >= 0) s.my[i] = a.payload;
        });
        b.addCase(thunkDeleteOrder.fulfilled, (s, a) => {
            s.my = s.my.filter(o => o.id !== a.payload);
        });
        b.addCase(thunkFetchMy.fulfilled, (s, a) => { s.my = a.payload ?? []; });
        b.addCase(thunkFetchSupplier.fulfilled, (s, a) => { s.supplier = a.payload ?? []; });
        b.addCase(thunkFetchModerator.fulfilled, (s, a) => { s.mod = a.payload; });
    }
});

export default ordersSlice.reducer;
