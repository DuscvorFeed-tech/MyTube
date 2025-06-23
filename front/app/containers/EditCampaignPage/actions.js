import {
  DEFAULT_ACTION,
  SET_ACTIVE_TAB,
  SET_DATA,
  SET_ERRORS,
  GET_WINNER_LIST,
  GET_CAMP_DETAILS,
  GET_TEMPLATE,
  GET_FORM,
  UPDATE_CAMPAIGN,
  RESET_DATA,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function setActiveTab(tab) {
  return {
    type: SET_ACTIVE_TAB,
    tab,
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
export function getWinnerList(data) {
  return {
    type: GET_WINNER_LIST,
    data,
  };
}
export function getCampDetails(data) {
  return {
    type: GET_CAMP_DETAILS,
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
export function updateCampaign(payload, btnType, modal) {
  return {
    type: UPDATE_CAMPAIGN,
    payload,
    btnType,
    modal,
  };
}
export function resetData() {
  return {
    type: RESET_DATA,
  };
}
