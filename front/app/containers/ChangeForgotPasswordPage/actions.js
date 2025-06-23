/*
 *
 * RegisterPage actions
 *
 */

import { DEFAULT_ACTION, SUBMIT_REGISTER, SET_ERRORS } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function submitChange(payload, onSubmitted) {
  return {
    type: SUBMIT_REGISTER,
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
