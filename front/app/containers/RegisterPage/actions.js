/*
 *
 * RegisterPage actions
 *
 */

import {
  DEFAULT_ACTION,
  SUBMIT_REGISTER,
  SET_ERRORS,
  SET_USERTYPE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function submitRegister(payload, onSubmitted) {
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

export function setUserType(userTypeId) {
  return {
    type: SET_USERTYPE,
    userTypeId,
  };
}
