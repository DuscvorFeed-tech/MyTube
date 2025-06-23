/*
 *
 * DashboardPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_STATS,
  GET_BAR_STATS,
  SET_ERRORS,
  SET_DATA,
  RESET_DATA,
  FETCH_CAMPAIGN,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function resetPage() {
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

export function getStats(data) {
  return {
    type: GET_STATS,
    data,
  };
}
export function getBarStats(data) {
  return {
    type: GET_BAR_STATS,
    data,
  };
}
export function setErrors(errors) {
  return {
    type: SET_ERRORS,
    errors,
  };
}

export function setData(key, value) {
  return {
    type: SET_DATA,
    key,
    value,
  };
}
