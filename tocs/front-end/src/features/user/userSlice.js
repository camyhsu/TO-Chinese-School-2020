import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../app/config";
import { UserStatus } from "./UserStatus";

const existingUser = JSON.parse(sessionStorage.getItem("user"));

// Need to get existing user from the session storage for scenarios where the
// user navigates by typing in the location bar of the browser
const initialState = existingUser
  ? {
      error: null,
      status: UserStatus.SIGNED_IN,
      user: existingUser,
    }
  : {
      error: null,
      status: UserStatus.NOT_SIGNED_IN,
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
      state.status = UserStatus.NOT_SIGNED_IN;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userSignIn.pending, (state) => {
        state.status = UserStatus.PENDING;
      })
      .addCase(userSignIn.fulfilled, (state, action) => {
        state.status = UserStatus.SIGNED_IN;
        state.user = action.payload;
      })
      .addCase(userSignIn.rejected, (state, action) => {
        const errorMessageFromSignInRequest = action.error.message;
        if (errorMessageFromSignInRequest.includes("status code 401")) {
          state.error = "Sign In Failed - incorrect username or password";
        } else if (errorMessageFromSignInRequest.includes("Network Error")) {
          state.error = "Server Unavailable - please try again later";
        } else {
          state.error = errorMessageFromSignInRequest;
        }
        state.status = UserStatus.SIGN_IN_FAILED;
      });
  },
});

export const { signOut } = userSlice.actions;

export default userSlice.reducer;
