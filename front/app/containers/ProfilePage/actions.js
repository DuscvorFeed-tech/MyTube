/*
 *
 * ProfilePage actions
 *
 */

import {
  DEFAULT_ACTION,
  LOAD_SNS_ACCOUNTS,
  LOADED_SNS_ACCOUNTS,
  SAVE_SNS_ACCOUNTS,
  SNS_ERROR,
  SUBMIT_REGISTER,
  SET_ERRORS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function loadSNSAccounts() {
  return {
    type: LOAD_SNS_ACCOUNTS,
  };
}

export function loadedSNSAccounts(response) {
  return {
    type: LOADED_SNS_ACCOUNTS,
    response,
  };
}

export function saveSNSAccounts(payload) {
  return {
    type: SAVE_SNS_ACCOUNTS,
    payload,
  };
}

export function snsError(error) {
  return {
    type: SNS_ERROR,
    error,
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
