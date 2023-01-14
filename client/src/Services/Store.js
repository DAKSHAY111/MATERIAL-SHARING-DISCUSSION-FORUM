import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import AppApi from "./AppApi";

const store = configureStore({
    reducer: AppApi.reducer,
    middleware: [thunk, AppApi.middleware]
});

export default store;