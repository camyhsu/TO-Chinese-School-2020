import {
  ACTION_SUCCESS,
  SET_MESSAGE,
} from './types';

import RegistrationService from '../services/registration.service';

const commonFn = (p, dispatch, isSchoolClass) => p.then(
  (response) => {
    dispatch({
      type: ACTION_SUCCESS,
      payload: '/admin/school-' + (isSchoolClass ? 'classes' : 'years')
    });
    dispatch({
      type: SET_MESSAGE,
      payload: response && 'Success',
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

const commonFamilyFn = (p, dispatch, familyId) => p.then(
  (response) => {
    const id = familyId || response.data.id;
    dispatch({
      type: ACTION_SUCCESS,
      payload: '/registration/family?id=' + id
    });
    dispatch({
      type: SET_MESSAGE,
      payload: response && 'Success',
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

const commonFn3 = (p, dispatch) => p.then(
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

const commonPersonFn = (p, dispatch, personId) => p.then(
  (response) => {
    dispatch({
      type: ACTION_SUCCESS,
      payload: '/registration/show-person?id=' + personId
    });
    dispatch({
      type: SET_MESSAGE,
      payload: response && 'Success',
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

const addSchoolClass = (obj) => (dispatch) => commonFn(RegistrationService.addSchoolClass(obj), dispatch, true);

const saveSchoolClass = (schoolClassId, obj) => (dispatch) => commonFn(RegistrationService.saveSchoolClass(schoolClassId, obj), dispatch, true);

const getSchoolClass = (schoolClassId) => (_dispatch) => RegistrationService.getSchoolClass(schoolClassId);

const addSchoolYear = (obj) => (dispatch) => commonFn(RegistrationService.addSchoolYear(obj), dispatch);

const saveSchoolYear = (schoolYearId, obj) => (dispatch) => commonFn(RegistrationService.saveSchoolYear(schoolYearId, obj), dispatch);

const getSchoolYear = (schoolYearId) => (_dispatch) => RegistrationService.getSchoolYear(schoolYearId);

const addNewFamily = (obj) => (dispatch) => commonFamilyFn(RegistrationService.addNewFamily(obj), dispatch);

const getFamilyAddress = (familyId) => (dispatch) => commonFn3(RegistrationService.getFamilyAddress(familyId), dispatch);

const saveFamilyAddress = (familyId, obj) => (dispatch) => commonFamilyFn(RegistrationService.saveFamilyAddress(familyId, obj), dispatch, familyId);

const addParent = (familyId, obj) => (dispatch) => commonFamilyFn(RegistrationService.addParent(familyId, obj), dispatch, familyId);

const addChild = (familyId, obj) => (dispatch) => commonFamilyFn(RegistrationService.addChild(familyId, obj), dispatch, familyId);

const getPersonalDetails = (personId) => (dispatch) => commonFn3(RegistrationService.getPersonalDetails(personId), dispatch);

const savePersonalDetails = (personId, obj) => (dispatch) => commonPersonFn(RegistrationService.savePersonalDetails(personId, obj), dispatch, personId);

const addPersonalAddress = (personId, obj) => (dispatch) => commonPersonFn(RegistrationService.addPersonalAddress(personId, obj), dispatch, personId);

const savePersonalAddress = (personId, obj) => (dispatch) => commonPersonFn(RegistrationService.savePersonalAddress(personId, obj), dispatch, personId);

export {
  addSchoolClass, saveSchoolClass, getSchoolClass, addSchoolYear, saveSchoolYear, getSchoolYear,
  addNewFamily, getFamilyAddress, saveFamilyAddress, addParent, addChild, savePersonalDetails,
  addPersonalAddress, savePersonalAddress, getPersonalDetails
}