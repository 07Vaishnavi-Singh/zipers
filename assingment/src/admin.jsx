import { createSlice } from '@reduxjs/toolkit';

const initialState2 = {
    isAdmin: false,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState2,
    reducers: {
        setAdminStatus: (state, action) => {
            state.isAdmin = action.payload;
        },
    },
});

export const { setAdminStatus } = adminSlice.actions;
export default adminSlice.reducer;
