/*
 *
 * ForgotPasswordPage reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  SUBMIT_FORGOT_PASSWORD_ERROR,
  SUBMIT_FORGOT_PASSWORD_SUCCESS,
} from './constants';

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const forgotPasswordPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case SUBMIT_FORGOT_PASSWORD_SUCCESS:
        draft.errors = null;
        break;
      case SUBMIT_FORGOT_PASSWORD_ERROR:
        draft.errors = action.errors;
        break;
    }
  });

export default forgotPasswordPageReducer;
