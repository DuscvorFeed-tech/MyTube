/*
 *
 * ActivateCompletePage actions
 *
 */

import { DEFAULT_ACTION, CONFIRM_CHANGE_EMAIL } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function submitConfirmChange(payload, onSubmitted) {
  return {
    type: CONFIRM_CHANGE_EMAIL,
    payload,
    onSubmitted,
  };
}
