import { combineReducers } from "redux";
import message from "./message.reducer";
import temp from "./temp.reducer";
import redirect from "./redirect.reducer";

export default combineReducers({
  message,
  temp,
  redirect,
});
