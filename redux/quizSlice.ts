import { API_URL } from "@env";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchQuizzes = createAsyncThunk("quiz/fetchQuizzes", async () => {
    const response = await axios.get(`${API_URL}/quizzes`);
    return response.data;
});

export const fetchQuizQuestions = createAsyncThunk(
    "quiz/fetchQuizQuestions",
    async (quizId: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/quizzes/${quizId}`); // ✅ Sửa lỗi "quizzess"
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Lỗi không xác định");
        }
    }
);

interface QuizState {
    quizzes: any[];
    questions: any[];
    loading: boolean;
    error: string | null;
}

const initialState: QuizState = {
    quizzes: [],
    questions: [],
    loading: false,
    error: null,
};

const quizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuizzes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuizzes.fulfilled, (state, action) => {
                state.quizzes = action.payload;
                state.loading = false;
            })
            .addCase(fetchQuizQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuizQuestions.fulfilled, (state, action) => {
                state.questions = action.payload;
                state.loading = false;
            })
            .addCase(fetchQuizQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default quizSlice.reducer;
