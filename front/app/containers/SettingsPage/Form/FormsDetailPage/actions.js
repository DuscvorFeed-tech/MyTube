/*
 *
 * FormsDetailPage actions
 *
 */

import {
  DEFAULT_ACTION,
  SET_FORM_DETAILS,
  SET_ERRORS,
  FETCH_FORM_DETAILS,
  UPDATE_FORM,
  SET_DATA,
  RESET_DATA,
  REMOVE_IMAGE_HEADER,
  SET_IMAGE_HEADER,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function setFormDetails(formDetails) {
  return {
    type: SET_FORM_DETAILS,
    formDetails,
  };
}

export function fetchFormDetails(id) {
  return {
    type: FETCH_FORM_DETAILS,
    id,
  };
}

export function setErrors(errors) {
  return {
    type: SET_ERRORS,
    errors,
  };
}

export function updateForm(payload, onSubmitted) {
  return {
    type: UPDATE_FORM,
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

export function removeImageHeader() {
  return {
    type: REMOVE_IMAGE_HEADER,
  };
}

export function setImageHeader(imageHeader) {
  return {
    type: SET_IMAGE_HEADER,
    imageHeader,
  };
}
