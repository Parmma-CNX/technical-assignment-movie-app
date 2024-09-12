import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "https://api.themoviedb.org/3";

const apiKey = import.meta.env.VITE_API_KEY;

export const fetchCredits = createAsyncThunk(
  "credit/fetchCredits",
  async ({ type, id }) => {
    const response = await axios.get(
      `${baseUrl}/${type}/${id}/credits?api_key=${apiKey}`
    );

    return response.data;
  }
);

const initialState = {
  credits: {},
  status: "idle",
  error: null,
};

const creditSlice = createSlice({
  name: "credit",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCredits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCredits.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.credits = action.payload;
      })
      .addCase(fetchCredits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        console.log(action.error.message);
      });
  },
});

export default creditSlice.reducer;
