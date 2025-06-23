/*
 *
 * FormPage actions
 *
 */

import {
  DEFAULT_ACTION,
  SUBMIT_FORM,
  GET_FORM,
  SET_ERRORS,
  SET_FORM,
  SET_DATA,
  RESET_PAGE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function submitForm(data) {
  return {
    type: SUBMIT_FORM,
    data,
  };
}
export function getForm(coupon) {
  return {
    type: GET_FORM,
    coupon,
  };
}
export function setErrors(error) {
  return {
    type: SET_ERRORS,
    error,
  };
}
export function setSuccess(success) {
  return {
    type: SET_DATA,
    success,
  };
}

export function setForm(data) {
  return {
    type: SET_FORM,
    data,
  };
}

export function resetPage() {
  return {
    type: RESET_PAGE,
  };
}
