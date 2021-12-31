import {
  ACTION_SUCCESS,
  SET_MESSAGE,
  SET_REGISTRATION_PREFERENCES,
} from "./types";

import StudentParentService from "../services/student-parent.service";

const commonFn = (p, dispatch, redirect, actionType) =>
  p.then(
    (response) => {
      dispatch({
        type: ACTION_SUCCESS,
        payload: redirect || "/home",
      });
      dispatch({
        type: SET_MESSAGE,
        payload: response && "Success",
      });
      if (actionType) {
        dispatch({
          type: actionType,
          payload: response.data,
        });
      }
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

const commonFn2 = (p, dispatch) =>
  p.then(
    (response) => response,
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

const getPersonalDetails = (personId) => (dispatch) =>
  commonFn2(StudentParentService.getPersonalDetails(personId), dispatch);

const savePersonalDetails = (personId, obj) => (dispatch) =>
  commonFn(StudentParentService.savePersonalDetails(personId, obj), dispatch);

const getPersonalAddress = (personId) => (dispatch) =>
  commonFn2(StudentParentService.getPersonalAddress(personId), dispatch);

const getFamilyAddress = (familyId) => (dispatch) =>
  commonFn2(StudentParentService.getFamilyAddress(familyId), dispatch);

const saveFamilyAddress = (familyId, obj) => (dispatch) =>
  commonFn(StudentParentService.saveFamilyAddress(familyId, obj), dispatch);

const savePersonalAddress = (personId, obj) => (dispatch) =>
  commonFn(StudentParentService.savePersonalAddress(personId, obj), dispatch);

const addPersonalAddress = (personId, obj) => (dispatch) =>
  commonFn(StudentParentService.addPersonalAddress(personId, obj), dispatch);

const addParent = (familyId, obj) => (dispatch) =>
  commonFn(StudentParentService.addParent(familyId, obj), dispatch);

const addChild = (familyId, obj) => (dispatch) =>
  commonFn(StudentParentService.addChild(familyId, obj), dispatch);

const saveRegistrationPreferences = (obj) => (dispatch) =>
  commonFn(
    StudentParentService.saveRegistrationPreferences(obj),
    dispatch,
    "/student/consent-release",
    SET_REGISTRATION_PREFERENCES
  );

const savePayment = (paymentId, payment) => (dispatch) =>
  commonFn(
    StudentParentService.savePayment(paymentId, payment),
    dispatch,
    "/student/registration-payment?id=" + paymentId
  );

export {
  getPersonalDetails,
  savePersonalDetails,
  getPersonalAddress,
  getFamilyAddress,
  saveFamilyAddress,
  savePersonalAddress,
  addPersonalAddress,
  addParent,
  addChild,
  saveRegistrationPreferences,
  savePayment,
};
