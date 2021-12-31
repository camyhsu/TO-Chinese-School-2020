import { ACTION_SUCCESS, SET_MESSAGE } from "./types";

import AccountingService from "../services/accounting.service";

const commonPersonFn = (p, dispatch, personId) =>
  p.then(
    (response) => {
      dispatch({
        type: ACTION_SUCCESS,
        payload: "/registration/show-person?id=" + personId,
      });
      dispatch({
        type: SET_MESSAGE,
        payload: response && "Success",
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

const addManualTransaction = (personId, obj) => (dispatch) =>
  commonPersonFn(
    AccountingService.addManualTransaction(obj),
    dispatch,
    personId
  );

export { addManualTransaction };
