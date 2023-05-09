import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
    accessToken: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
    },
});

const initialAdminState = {
    isAdmin: false,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState: initialAdminState,
    reducers: {
        setAdminStatus: (state, action) => {
            state.isAdmin = action.payload;
        },
    },
});

export const { setAccessToken } = authSlice.actions;
export const { setAdminStatus } = adminSlice.actions;

export default configureStore({
    reducer: {
        auth: authSlice.reducer,
        admin: adminSlice.reducer,
    },
});
