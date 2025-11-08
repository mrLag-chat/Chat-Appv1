import { createSlice } from "@reduxjs/toolkit";
let loaderSlice = createSlice({
    name: "loader",
    initialState: { loader: false },
    reducers: {
        showLoading(state) {
            console.log(state);
            return { ...state, loader: true }
        },
        hideLoading(state) {
            return { ...state, loader: false }
        }

    }
})


export const { showLoading, hideLoading } = loaderSlice.actions;
export default loaderSlice.reducer;
