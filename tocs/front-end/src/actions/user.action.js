import { ACTION_SUCCESS, SET_MESSAGE } from "./types";

import UserService from "../services/user.service";

const commonFn = (p, dispatch) =>
  p.then(
    (response) => {
      dispatch({
        type: ACTION_SUCCESS,
        payload: "/home",
      });
      console.log(
        response && ((response.data && response.data.message) || response.data)
      );
      dispatch({
        type: SET_MESSAGE,
        payload:
          response &&
          ((response.data && response.data.message) || response.data),
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

const savePerson = (personId, obj) => (dispatch) =>
  commonFn(UserService.savePerson(personId, obj), dispatch);

const addParent = (familyId, obj) => (dispatch) =>
  commonFn(UserService.addParent(familyId, obj), dispatch);

const addChild = (familyId, obj) => (dispatch) =>
  commonFn(UserService.addChild(familyId, obj), dispatch);

const changePassword = (obj) => (dispatch) =>
  commonFn(UserService.changePassword(obj), dispatch);

export { savePerson, addParent, addChild, changePassword };
