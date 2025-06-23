/*
 *
 * ChangePasswordPage actions
 *
 */

import {
  DEFAULT_ACTION,
  SUBMIT_CHANGE_PASSWORD,
  SET_ERRORS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function submitChangePassword(payload, onSubmitted) {
  return {
    type: SUBMIT_CHANGE_PASSWORD,
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
