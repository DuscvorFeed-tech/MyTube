/*
 *
 * AddFormPage actions
 *
 */

import {
  DEFAULT_ACTION,
  SUBMIT_FORM,
  SET_ERRORS,
  SET_FORM_DATA,
  INPUT_IMAGE,
  REMOVE_IMAGE_HEADER,
  SET_IMAGE_HEADER,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function submitForm(payload, onSubmitted) {
  return {
    type: SUBMIT_FORM,
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

export function setFormData(key, value) {
  return {
    type: SET_FORM_DATA,
    key,
    value,
  };
}

export function inputImage(fieldname, value) {
  return {
    type: INPUT_IMAGE,
    [fieldname]: value,
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
