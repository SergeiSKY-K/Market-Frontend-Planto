import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    login: string | null;
    roles: string[];
}

const initialState: UserState = {
    login: null,
    roles: [],
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.login = action.payload.login;
            state.roles = action.payload.roles;
        },
        clearUser(state) {
            state.login = null;
            state.roles = [];
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
