import { combineReducers } from "redux";
import auth from "./auth.reducer";
import message from "./message.reducer";
import temp from "./temp.reducer";
import redirect from "./redirect.reducer";

export default combineReducers({
  auth,
  message,
  temp,
  redirect,
});
