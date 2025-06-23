/*
 *
 * ForgotPasswordPage actions
 *
 */

import {
  SUBMIT_FORGOT_PASSWORD,
  SUBMIT_FORGOT_PASSWORD_SUCCESS,
  SUBMIT_FORGOT_PASSWORD_ERROR,
} from './constants';

export function submitForgotPassword(payload, onSubmitted) {
  return {
    type: SUBMIT_FORGOT_PASSWORD,
    payload,
    onSubmitted,
  };
}

export function submitForgotPasswordSuccess() {
  return {
    type: SUBMIT_FORGOT_PASSWORD_SUCCESS,
  };
}

export function submitForgotPasswordError(errors) {
  return {
    type: SUBMIT_FORGOT_PASSWORD_ERROR,
    errors,
  };
}
