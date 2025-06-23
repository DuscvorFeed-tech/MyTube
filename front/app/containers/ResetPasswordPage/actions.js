/*
 *
 * ResetPasswordPage actions
 *
 */

import {
  VALIDATE_CODE,
  SET_LOADING,
  SUBMIT_PASSWORD,
  SET_ERRORS,
} from './constants';

export function validateCode(payload) {
  return {
    type: VALIDATE_CODE,
    payload,
  };
}

export function setLoading(payload) {
  return {
    type: SET_LOADING,
    payload,
  };
}

export function submitPassword(payload, onSubmitted) {
  return {
    type: SUBMIT_PASSWORD,
    payload,
    onSubmitted,
  };
}

export function setErrors(payload) {
  return {
    type: SET_ERRORS,
    payload,
  };
}
