import { createSlice } from "@reduxjs/toolkit";

const initialState = []
const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        setTodo: (state, action) => {
            state.push(action.payload)
        }
    }
})

export const selectAllTodo = (state) => state.todo

export const { setTodo } = todoSlice.actions

export default todoSlice.reducer