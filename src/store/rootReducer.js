// store/rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import moviesSlice from "../features/movies/moviesSlice";
import detailsSlice from "../features/details/detailsSlice";
import creditsSlice from "../features/credits/creditsSlice";
import authSlice from "../features/auth/authSlice";

const rootReducer = combineReducers({
  movies: moviesSlice,
  details: detailsSlice,
  credits: creditsSlice,
  auth: authSlice,
});

export default rootReducer;
