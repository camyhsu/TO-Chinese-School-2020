import { combineReducers } from "redux";
import auth from "./auth.reducer";
import message from "./message.reducer";
import user from "./user.reducer";

export default combineReducers({
  auth,
  message,
  user
});