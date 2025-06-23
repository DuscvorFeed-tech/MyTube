/*
 *
 * CampaignDetailPage actions
 *
 */

import {
  DEFAULT_ACTION,
  SET_DATA,
  SET_ERRORS,
  SET_TAB,
  GET_STATS,
  GET_WINNER_LIST,
  GET_CAMP_DETAILS,
  GET_TEMPLATE,
  GET_FORM,
  GET_PRIZE_DISTRIBUTION,
  GENERATE_WINNER,
  SELECT_WINNER,
  CANCEL_WINNER,
  UPDATE_CLAIM_STATUS,
  RESET_DATA,
  DOWNLOAD_CSV,
  FORCE_END,
  SEND_DM,
  ADD_POST_LINK,
  BACK_FILL,
  UPLOAD_CSV,
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
export function setErrors(errors) {
  return {
    type: SET_ERRORS,
    errors,
  };
}
export function setTab(tab) {
  return {
    type: SET_TAB,
    tab,
  };
}
export function getWinnerList(
  data,
  callDetail = false,
  ids = null,
  selectAllParticipants = false,
) {
  return {
    type: GET_WINNER_LIST,
    data,
    callDetail,
    ids,
    selectAllParticipants,
  };
}
export function getCampDetails(data) {
  return {
    type: GET_CAMP_DETAILS,
    data,
  };
}
export function getStats(data) {
  return {
    type: GET_STATS,
    data,
  };
}
export function getPrizeDistribution(data) {
  return {
    type: GET_PRIZE_DISTRIBUTION,
    data,
  };
}

export function getTemplate(id) {
  return {
    type: GET_TEMPLATE,
    id,
  };
}

export function getForm(id) {
  return {
    type: GET_FORM,
    id,
  };
}

export function generateWinner(data) {
  return {
    type: GENERATE_WINNER,
    data,
  };
}

export function selectWinner(data, dataEntries) {
  return {
    type: SELECT_WINNER,
    data,
    dataEntries,
  };
}

export function cancelWinner(data) {
  return {
    type: CANCEL_WINNER,
    data,
  };
}

export function changeClaimStatus(data) {
  return {
    type: UPDATE_CLAIM_STATUS,
    data,
  };
}

export function resetData() {
  return {
    type: RESET_DATA,
  };
}
export function downloadCsv(data) {
  return {
    type: DOWNLOAD_CSV,
    data,
  };
}
export function forceEnd(data, onSubmitted) {
  return {
    type: FORCE_END,
    data,
    onSubmitted,
  };
}
export function sendDM(data) {
  return {
    type: SEND_DM,
    data,
  };
}

export function addPostLink(id, snsType) {
  return {
    type: ADD_POST_LINK,
    id,
    snsType,
  };
}

export function backFill(id) {
  return {
    type: BACK_FILL,
    id,
  };
}

export function uploadCsv(data) {
  return {
    type: UPLOAD_CSV,
    data,
  };
}
