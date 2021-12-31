import { SET_REGISTRATION_PREFERENCES } from "../actions/types";

const initialState = {};

export default function fn(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_REGISTRATION_PREFERENCES:
      const x = { ...state, registrationPreferencesResponse: payload };
      return x;

    default:
      return state;
  }
}
