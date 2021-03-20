import {
    SAVE_PERSON_SUCCESS,
    SET_MESSAGE,
  } from "./types";

import UserService from "../services/user.service";

const commonFn = (p, dispatch) => {
  return p.then(
    (response) => {
      dispatch({
        type: SAVE_PERSON_SUCCESS,
        payload: '/home'
      });

      dispatch({
        type: SET_MESSAGE,
        payload: response.data.message,
      });
      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
}

const savePerson = (personId, obj) => (dispatch) => {
    return commonFn(UserService.savePerson(personId, obj), dispatch);
};

const addParent = (familyId, obj) => (dispatch) => {
  return commonFn(UserService.addParent(familyId, obj), dispatch);
};

const addChild = (familyId, obj) => (dispatch) => {
  return commonFn(UserService.addChild(familyId, obj), dispatch);
};

export { savePerson, addParent, addChild }