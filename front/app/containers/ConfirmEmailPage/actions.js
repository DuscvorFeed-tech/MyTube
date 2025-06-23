/*
 *
 * ConfirmEmailPage actions
 *
 */

import { DEFAULT_ACTION, CONFIRM_EMAIL, CONFIRM_SUCCESS } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function confirmEmail(data) {
  return {
    type: CONFIRM_EMAIL,
    data,
  };
}

export function confirmSuccess(success) {
  return {
    type: CONFIRM_SUCCESS,
    success,
  };
}
