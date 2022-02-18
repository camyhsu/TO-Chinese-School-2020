import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../app/config";

const existingUser = JSON.parse(sessionStorage.getItem("user"));

// Need to get existing user from the session storage for scenarios where the
// user navigates by typing in the location bar of the browser
const initialState = existingUser
  ? {
      error: null,
      status: "signInSucceeded",
      user: existingUser,
    }
  : {
      error: null,
      status: "notSignedIn",
      user: null,
    };

export const userSignIn = createAsyncThunk(
  "user/signIn",
  async (credential) => {
    const response = await axios.post(`${config.apiUrl}/signin`, credential);
    if (response.data.accessToken) {
      sessionStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  }
);

export const userSignOut = () => (dispatch) => {
  sessionStorage.removeItem("user");
  dispatch(signOut());
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signOut(state) {
      state.error = null;
      state.status = "notSignedIn";
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userSignIn.pending, (state) => {
        state.status = "pending";
      })
      .addCase(userSignIn.fulfilled, (state, action) => {
        state.status = "signInSucceeded";
        state.user = action.payload;
      })
      .addCase(userSignIn.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "signInFailed";
      });
  },
});

export const { signOut } = userSlice.actions;

export default userSlice.reducer;
