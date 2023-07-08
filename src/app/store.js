import { configureStore } from "@reduxjs/toolkit";
import todoSliceReducer from "../features/todo/todoSlice";

export const store = configureStore({
    'todo': todoSliceReducer

})