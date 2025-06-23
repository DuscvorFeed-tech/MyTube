/*
 *
 * AddTemplatePage actions
 *
 */

import {
  FETCH_COMMON_TYPES,
  SET_COMMON_TYPES,
  SUBMIT_TEMPLATE,
  SET_ERRORS,
} from './constants';

export function fetchCommonTypes() {
  return {
    type: FETCH_COMMON_TYPES,
  };
}

export function setCommonTypes(payload) {
  return {
    type: SET_COMMON_TYPES,
    payload,
  };
}

export function submitTemplate(data, onSubmitted) {
  return {
    type: SUBMIT_TEMPLATE,
    data,
    onSubmitted,
  };
}

export function setErrors(errors) {
  return {
    type: SET_ERRORS,
    errors,
  };
}
