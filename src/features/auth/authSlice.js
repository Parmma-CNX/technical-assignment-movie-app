import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../services/firebase";
export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, thunkAPI) => {
    const googleProvider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      return {
        uid: user.uid,
        displayName: user.displayName || "",
        email: user.email || "",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logoutFromApp = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await signOut(auth);
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const setUser = createAsyncThunk(
  "auth/setUser",
  async ({ uid, email, displayName }) => {
    return {
      uid: uid,
      displayName: displayName || "",
      email: email || "",
    };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle",
    error: null,
    loading: true,
  },

  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logoutFromApp.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
      });

    builder
      .addCase(setUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(setUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      });
  },
});

export const { clearUser } = authSlice.actions;
export default authSlice.reducer;
