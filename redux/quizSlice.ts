import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuizState {
    quizzId: string | null;
}

const initialState: QuizState = {
    quizzId: null,
};

const quizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers: {
        setQuizzId: (state, action: PayloadAction<string>) => {
            state.quizzId = action.payload;
        },
        clearQuizzId: (state) => {
            state.quizzId = null;
        },
    },
});

export const { setQuizzId, clearQuizzId } = quizSlice.actions;
export default quizSlice.reducer;
