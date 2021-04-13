import { ACTION_SUCCESS } from "../actions/types";

const initialState = { redirect: '' };

export default function fn(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ACTION_SUCCESS:
      return { redirect: payload };

    default:
      return state;
  }
}