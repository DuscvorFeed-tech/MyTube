/*
 *
 * PublishedPage actions
 *
 */

import {
  DEFAULT_ACTION,
  FETCH_CAMPAIGN,
  SET_CAMPAIGN_LIST,
  SET_ERROR,
  SET_DATA,
  RESET_DATA,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function resetData() {
  return {
    type: RESET_DATA,
  };
}

export function fetchCampaign(data) {
  return {
    type: FETCH_CAMPAIGN,
    data,
  };
}

export function setCampaignList(payload) {
  return {
    type: SET_CAMPAIGN_LIST,
    payload,
  };
}
export function setError(error) {
  return {
    type: SET_ERROR,
    error,
  };
}
export function setData(key, value) {
  return {
    type: SET_DATA,
    key,
    value,
  };
}
