import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./tokenSlice";
import userReducer from "./userSlice";
import ordersReducer from "./ordersSlice";
import cartReducer from "./cartSlice"; // +++

export const store = configureStore({
    reducer: {
        token: tokenReducer,
        user: userReducer,
        orders: ordersReducer,
        cart: cartReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
