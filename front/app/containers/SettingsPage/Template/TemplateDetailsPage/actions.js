/*
 *
 * TemplateDetailsPage actions
 *
 */

import {
  FETCH_TEMPLATE_DETAIL,
  SET_TEMPLATE_DETAIL,
  SET_ERRORS,
  UPDATE_TEMPLATE,
  SET_DATA,
  RESET_DATA,
} from './constants';

export function fetchTemplateDetail(id) {
  return {
    type: FETCH_TEMPLATE_DETAIL,
    id,
  };
}

export function setTemplateDetail(payload) {
  return {
    type: SET_TEMPLATE_DETAIL,
    payload,
  };
}

export function setErrors(errors) {
  return {
    type: SET_ERRORS,
    errors,
  };
}

export function updateTemplate(payload, onSubmitted) {
  return {
    type: UPDATE_TEMPLATE,
    payload,
    onSubmitted,
  };
}

export function setData(key, value) {
  return {
    type: SET_DATA,
    key,
    value,
  };
}

export function resetData() {
  return {
    type: RESET_DATA,
  };
}
