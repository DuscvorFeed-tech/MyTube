/*
 *
 * ChangeEmailPage actions
 *
 */

import { DEFAULT_ACTION, SUBMIT_CHANGE_EMAIL, SET_ERRORS } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function submitChangeLogin(payload, onSubmitted) {
  return {
    type: SUBMIT_CHANGE_EMAIL,
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
