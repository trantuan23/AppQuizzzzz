import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface reviewState {
    reviewId: string | null;
}

const initialState: reviewState = {
    reviewId: null,
};

const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {
        setReviewId: (state, action: PayloadAction<string>) => {
            state.reviewId = action.payload;
        },
        clearreviewId: (state) => {
            state.reviewId = null;
        },
    },
});

export const { setReviewId, clearreviewId } = reviewSlice.actions;
export default reviewSlice.reducer;
