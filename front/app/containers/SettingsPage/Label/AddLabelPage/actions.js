/*
 *
 * AddLabelPage actions
 *
 */

import { SUBMIT_LABEL, SET_ERRORS } from './constants';

export function submitLabel(payload, onSubmitted) {
  return {
    type: SUBMIT_LABEL,
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
