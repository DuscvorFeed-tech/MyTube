/*
 *
 * SettingsPage actions
 *
 */

import {
  FETCH_LABEL_LIST,
  SET_LABELS,
  DELETE_LABEL,
  LINK_ACCOUNT,
  FETCH_ACCOUNT_LIST,
  SET_ACCOUNTS,
  SET_FORM_LIST,
  FETCH_FORM_LIST,
  FETCH_TEMPLATE_LIST,
  SET_TEMPLATES,
  DELETE_TEMPLATE,
  DELETE_FORM,
  SET_ERROR,
  RESET_PAGE,
  SET_SNS_AS_DEFAULT,
  DELETE_SNS_ACCOUNT,
  SET_LOADING,
} from './constants';

export function fetchLabelList(page) {
  return {
    type: FETCH_LABEL_LIST,
    page,
  };
}
export function setLoading(loading) {
  return {
    type: SET_LOADING,
    loading,
  };
}
export function resetPage() {
  return {
    type: RESET_PAGE,
  };
}

export function fetchAccountList(page) {
  return {
    type: FETCH_ACCOUNT_LIST,
    page,
  };
}

export function setLabels(payload) {
  return {
    type: SET_LABELS,
    payload,
  };
}

export function setAccounts(payload) {
  return {
    type: SET_ACCOUNTS,
    payload,
  };
}

export function deleteLabel(id) {
  return {
    type: DELETE_LABEL,
    id,
  };
}

export function linkAccount(snsType) {
  return {
    type: LINK_ACCOUNT,
    snsType,
  };
}

export function fetchFormList(page) {
  return {
    type: FETCH_FORM_LIST,
    page,
  };
}

export function setFormList(payload) {
  return {
    type: SET_FORM_LIST,
    payload,
  };
}

export function fetchTemplateList(page) {
  return {
    type: FETCH_TEMPLATE_LIST,
    page,
  };
}

export function setTemplates(payload) {
  return {
    type: SET_TEMPLATES,
    payload,
  };
}

export function deleteTemplate(id) {
  return {
    type: DELETE_TEMPLATE,
    id,
  };
}
export function deleteForm(id) {
  return {
    type: DELETE_FORM,
    id,
  };
}

export function setError(error) {
  return {
    type: SET_ERROR,
    error,
  };
}

export function setSnsAsDefault(id) {
  return {
    type: SET_SNS_AS_DEFAULT,
    id,
  };
}

export function deleteSnsAccount(id) {
  return {
    type: DELETE_SNS_ACCOUNT,
    id,
  };
}
