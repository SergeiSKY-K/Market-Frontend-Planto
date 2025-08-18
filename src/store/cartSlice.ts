// src/store/cartSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export type CartItem = {
    id: string;
    name: string;
    price: number;
    supplierLogin: string;
    qty: number;
};

type CartState = { items: CartItem[] };
const initialState: CartState = { items: [] };

const slice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (
            s,
            a: PayloadAction<{ id: string; name: string; price: number; supplierLogin: string; qty?: number }>
        ) => {
            const { id, name, price, supplierLogin } = a.payload;
            const inc = a.payload.qty ?? 1;
            const i = s.items.findIndex(x => x.id === id);
            if (i >= 0) s.items[i].qty += inc;
            else s.items.push({ id, name, price, supplierLogin, qty: inc });
        },
        changeQty: (s, a: PayloadAction<{ id: string; qty: number }>) => {
            const i = s.items.findIndex(x => x.id === a.payload.id);
            if (i >= 0) s.items[i].qty = Math.max(1, a.payload.qty);
        },
        removeFromCart: (s, a: PayloadAction<string>) => {
            s.items = s.items.filter(x => x.id !== a.payload);
        },
        clearCart: s => { s.items = []; },
    },
});

export const { addToCart, changeQty, removeFromCart, clearCart } = slice.actions;

export const selectCart = (s: RootState) => s.cart.items;
export const selectCartCount = (s: RootState) => s.cart.items.reduce((n, i) => n + i.qty, 0);
export const selectCartTotal = (s: RootState) => s.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);

export default slice.reducer;
