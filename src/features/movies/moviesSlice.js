import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const imagePath = "https://image.tmdb.org/t/p/w500";
export const imagePathOriginal = "https://image.tmdb.org/t/p/original";

const baseUrl = "https://api.themoviedb.org/3";
const apiKey = import.meta.env.VITE_API_KEY;

// TRENDING
export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (timeWindow) => {
    const response = await axios.get(
      `${baseUrl}/trending/all/${timeWindow}?api_key=${apiKey}`
    );

    return response.data?.results;
  }
);

const initialState = {
  list: [],
  watchlist: [],
  status: "idle",
  error: null,
  time_window: "day",
  isLoading: true,
};

const movieSlice = createSlice({
  name: "movies",
  initialState: initialState,
  reducers: {
    setTimeWindow(state, action) {
      state.time_window = action.payload;
    },
    setWatchList(state, action) {
      state.watchlist = action.payload;
    },

    setLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        console.log(action.error.message);
      });
  },
});

export const { setTimeWindow, setWatchList, setLoading } = movieSlice.actions;
export default movieSlice.reducer;
