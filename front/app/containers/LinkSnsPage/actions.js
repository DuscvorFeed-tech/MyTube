/*
 *
 * LinkSnsPage actions
 *
 */

import { VERIFY_TWITTER, SET_ERRORS } from './constants';

export function verifyTwitter(payload) {
  return {
    type: VERIFY_TWITTER,
    payload,
  };
}

export function setErrors(errors) {
  return {
    type: SET_ERRORS,
    errors,
  };
}
