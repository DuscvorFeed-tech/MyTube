/*
 *
 * CampaignPage actions
 *
 */

import {
  SET_LABELS,
  FETCH_LABELS,
  FETCH_WINNER_TEMPLATES,
  FETCH_THANKYOU_TEMPLATES,
  FETCH_FORMS,
  SET_WINNER_TEMPLATES,
  SET_THANKYOU_TEMPLATES,
  SET_FORMS,
  SET_LOSER_TEMPLATES,
  FETCH_TEMPLATES,
  SUBMIT_CAMPAIGN,
  SET_ERRORS,
  SET_CAMPAIGN_ID,
  SET_FORM_COMPLETE_TEMPLATES,
  SET_CAMPAIGN_LIST,
  SET_LOADING,
} from './constants';

export function setLabels(payload) {
  return {
    type: SET_LABELS,
    payload,
  };
}

export function fetchLabels() {
  return {
    type: FETCH_LABELS,
  };
}

export function fetchTemplates(state) {
  return {
    type: FETCH_TEMPLATES,
    state,
  };
}

export function fetchWinnerTemplates() {
  return {
    type: FETCH_WINNER_TEMPLATES,
  };
}

export function fetchThankyouTemplates() {
  return {
    type: FETCH_THANKYOU_TEMPLATES,
  };
}

export function fetchForms() {
  return {
    type: FETCH_FORMS,
  };
}

export function setWinnerTemplates(payload) {
  return {
    type: SET_WINNER_TEMPLATES,
    payload,
  };
}

export function setThankyouTemplates(payload) {
  return {
    type: SET_THANKYOU_TEMPLATES,
    payload,
  };
}

export function setLoserTemplates(payload) {
  return {
    type: SET_LOSER_TEMPLATES,
    payload,
  };
}

export function setFormCompleteTemplates(payload) {
  return {
    type: SET_FORM_COMPLETE_TEMPLATES,
    payload,
  };
}

export function setForms(payload) {
  return {
    type: SET_FORMS,
    payload,
  };
}

export function submitCampaign(payload, saveOnly) {
  return {
    type: SUBMIT_CAMPAIGN,
    payload,
    saveOnly,
  };
}

export function setErrors(errors) {
  return {
    type: SET_ERRORS,
    errors,
  };
}
export function setLoading(loading) {
  return {
    type: SET_LOADING,
    loading,
  };
}

export function setCampaignId(campaignId) {
  return {
    type: SET_CAMPAIGN_ID,
    campaignId,
  };
}
export function setCampaignList(campaignList) {
  return {
    type: SET_CAMPAIGN_LIST,
    campaignList,
  };
}
