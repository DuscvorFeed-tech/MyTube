import { DEFAULT_ACTION, CONFIRM_KEY_CONFIRMATION_CODE } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function confirmKeyAndConfirmationCode(data) {
  return {
    type: CONFIRM_KEY_CONFIRMATION_CODE,
    data,
  };
}
