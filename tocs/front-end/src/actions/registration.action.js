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

const commonFamilyFn = (p, dispatch) => p.then(
  (response) => {
    console.log(response.data)
    const id = response.data.id;
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

const addSchoolClass = (obj) => (dispatch) => commonFn(RegistrationService.addSchoolClass(obj), dispatch, true);

const saveSchoolClass = (schoolClassId, obj) => (dispatch) => commonFn(RegistrationService.saveSchoolClass(schoolClassId, obj), dispatch, true);

const getSchoolClass = (schoolClassId) => (_dispatch) => RegistrationService.getSchoolClass(schoolClassId);

const addSchoolYear = (obj) => (dispatch) => commonFn(RegistrationService.addSchoolYear(obj), dispatch);

const saveSchoolYear = (schoolYearId, obj) => (dispatch) => commonFn(RegistrationService.saveSchoolYear(schoolYearId, obj), dispatch);

const getSchoolYear = (schoolYearId) => (_dispatch) => RegistrationService.getSchoolYear(schoolYearId);

const addNewFamily = (obj) => (dispatch) => commonFamilyFn(RegistrationService.addNewFamily(obj), dispatch);

export {
  addSchoolClass, saveSchoolClass, getSchoolClass, addSchoolYear, saveSchoolYear, getSchoolYear,
  addNewFamily
}