import {
    ACTION_SUCCESS,
    SET_MESSAGE,
  } from './types';

import RegistrationService from '../services/registration.service';

const commonFn = (p, dispatch) => p.then(
    (response) => {
      dispatch({
        type: ACTION_SUCCESS,
        payload: '/admin/school-years'
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

const addSchoolYear = (obj) => (dispatch) => commonFn(RegistrationService.addSchoolYear(obj), dispatch);

const saveSchoolYear = (schoolYearId, obj) => (dispatch) => commonFn(RegistrationService.saveSchoolYear(schoolYearId, obj), dispatch);

const getSchoolYear = (schoolYearId) => (dispatch) => RegistrationService.getSchoolYear(schoolYearId);

export { addSchoolYear, saveSchoolYear, getSchoolYear }