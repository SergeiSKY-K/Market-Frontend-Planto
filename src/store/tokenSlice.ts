import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface TokenState {
    accessToken: string | null;
    ready: boolean;
}

const initialState: TokenState = {
    accessToken: null,
    ready: false,
};

const tokenSlice = createSlice({
    name: "token",
    initialState,
    reducers: {
        setAccessToken(state, action: PayloadAction<string>) {
            state.accessToken = action.payload;
        },
        clearAccessToken(state) {
            state.accessToken = null;
        },
        setAuthReady(state) {
            state.ready = true;
        },
    },
});

export const {
    setAccessToken,
    clearAccessToken,
    setAuthReady,
} = tokenSlice.actions;

export default tokenSlice.reducer;
