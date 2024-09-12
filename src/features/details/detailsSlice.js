import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const imagePath = "https://image.tmdb.org/t/p/w500";
export const imagePathOriginal = "https://image.tmdb.org/t/p/original";

const apiKey = import.meta.env.VITE_API_KEY;

const baseUrl = "https://api.themoviedb.org/3";

// MOVIES &  SERIES - Details
export const fetchDetails = createAsyncThunk(
  "details/fetchDetails",
  async ({ type, id }) => {
    const response = await axios.get(
      `${baseUrl}/${type}/${id}?api_key=${apiKey}`
    );

    return response?.data;
  }
);

export const fetchVideos = createAsyncThunk(
  "details/fetchVideos",
  async ({ type, id }) => {
    const response = await axios.get(
      `${baseUrl}/${type}/${id}/videos?api_key=${apiKey}`
    );

    return response?.data;
  }
);

export const fetchDiscoverMovies = createAsyncThunk(
  "details/fetchDiscoverMovies",
  async ({ page, sort_by }) => {
    const response = await axios.get(
      `${baseUrl}/discover/movie?api_key=${apiKey}&page=${page}&sort_by=${sort_by}`
    );
    return response.data;
  }
);

export const fetchTvSeries = createAsyncThunk(
  "details/fetchTvSeries",
  async ({ page, sort_by }) => {
    const response = await axios.get(
      `${baseUrl}/discover/tv?api_key=${apiKey}&page=${page}&sort_by=${sort_by}`
    );
    return response.data;
  }
);

export const searchData = createAsyncThunk(
  "details/searchData",
  async ({ query, page }) => {
    const response = await axios.get(
      `${baseUrl}/search/multi?api_key=${apiKey}&query=${query}&page=${page}`
    );
    return response.data;
  }
);

const initialState = {
  details: {},
  videos: {},
  discovers: {},
  shows: {},
  search_movies: {},
  search_result: "",
  query: "",
  page: 1,
  status: "idle",
  loadingMovieVideo: false,
  loadingShow: false,
  loadingDiscoverMovie: false,
  isSearchLoading: false,
  sort_by: "popularity.desc",
  error: null,
  isInWatchList: false,
};

const detailSlice = createSlice({
  name: "details",
  initialState: initialState,
  reducers: {
    setActivePage(state, action) {
      state.page = action.payload;
    },
    selectedSortBy(state, action) {
      state.sort_by = action.payload;
      state.page = 1;
    },

    searchMultipleData(state, action) {
      state.query = action.payload;
      state.page = 1;
    },

    setSearchResults: (state, action) => {
      state.search_result = action.payload;
    },

    setToWatchList: (state, action) => {
      state.isInWatchList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.details = action.payload;
      })
      .addCase(fetchDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch videos";
      });

    builder
      .addCase(fetchVideos.pending, (state) => {
        state.loadingMovieVideo = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.videos = action.payload;
        state.loadingMovieVideo = false;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loadingMovieVideo = false;
        state.error = action.error.message || "Failed to fetch videos";
      });

    builder
      .addCase(fetchDiscoverMovies.pending, (state) => {
        state.loadingDiscoverMovie = true;
        state.error = null;
      })
      .addCase(fetchDiscoverMovies.fulfilled, (state, action) => {
        state.loadingDiscoverMovie = false;
        state.discovers = action.payload;
      })
      .addCase(fetchDiscoverMovies.rejected, (state, action) => {
        state.loadingDiscoverMovie = false;
        state.error = action.error.message || "Failed to fetch videos";
      });

    builder
      .addCase(fetchTvSeries.pending, (state) => {
        state.loadingShow = true;
        state.error = null;
      })
      .addCase(fetchTvSeries.fulfilled, (state, action) => {
        state.loadingShow = false;
        state.shows = action.payload;
      })
      .addCase(fetchTvSeries.rejected, (state, action) => {
        state.loadingShow = false;
        state.error = action.error.message || "Failed to fetch videos";
      });

    builder
      .addCase(searchData.pending, (state) => {
        state.isSearchLoading = true;
        state.error = null;
      })
      .addCase(searchData.fulfilled, (state, action) => {
        state.isSearchLoading = false;
        state.search_movies = action.payload;
        state.page = action.payload?.page;
      })
      .addCase(searchData.rejected, (state, action) => {
        state.isSearchLoading = false;
        state.error = action.error.message || "Failed to fetch videos";
      });
  },
});

export const {
  setActivePage,
  selectedSortBy,
  searchMultipleData,
  setSearchResults,
  setToWatchList,
} = detailSlice.actions;
export default detailSlice.reducer;
