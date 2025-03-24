import { configureStore } from "@reduxjs/toolkit";
import quizReducer from "./quizSlice"
import reviewSlice from "./resultSlice"

export const store = configureStore({
    reducer: {
        quiz: quizReducer,
        review: reviewSlice
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
