import { configureStore } from "@reduxjs/toolkit";
import loader from './loaderSlice'
import user from "./userSlice"

let store = configureStore({
    reducer: {
        loader,
        user,
    }
})

export default store