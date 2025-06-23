/*
 *
 * LoginPage actions
 *
 */

import { DEFAULT_ACTION, SUBMIT_LOGIN, SET_ERRORS } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function submitLogin(payload, onSubmitted) {
  return {
    type: SUBMIT_LOGIN,
    payload,
    onSubmitted,
  };
}

export function setErrors(errors) {
  return {
    type: SET_ERRORS,
    errors,
  };
}
