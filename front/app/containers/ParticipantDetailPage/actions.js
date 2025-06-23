/*
 *
 * ParticipantDetailPage actions
 *
 */

import {
  DEFAULT_ACTION,
  SET_DATA,
  SET_ERRORS,
  GET_PART_DETAILS,
  GENERATE_WINNER,
  SELECT_WINNER,
  CANCEL_WINNER,
  SEND_MESSAGE,
  UPDATE_CLAIM_STATUS,
  RESET_DATA,
  UPDATE_WINNER_INFO,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function setData(key, value) {
  return {
    type: SET_DATA,
    key,
    value,
  };
}

export function setErrors(error) {
  return {
    type: SET_ERRORS,
    error,
  };
}

export function getPartDetails(data) {
  return {
    type: GET_PART_DETAILS,
    data,
  };
}

export function generateWinner(data) {
  return {
    type: GENERATE_WINNER,
    data,
  };
}

export function selectWinner(data) {
  return {
    type: SELECT_WINNER,
    data,
  };
}

export function cancelWinner(data) {
  return {
    type: CANCEL_WINNER,
    data,
  };
}

export function sendMessage(data, userAccount) {
  return {
    type: SEND_MESSAGE,
    data,
    userAccount,
  };
}

export function changeClaimStatus(data) {
  return {
    type: UPDATE_CLAIM_STATUS,
    data,
  };
}

export function changeWinnerInfo(data) {
  return {
    type: UPDATE_WINNER_INFO,
    data,
  };
}

export function resetData() {
  return {
    type: RESET_DATA,
  };
}
