/*
 *
 * LanguageProvider actions
 *
 */

import { CHANGE_LOCALE, SUBMIT_LANGUAGE, SET_ERRORS } from './constants';

export function changeLocale(languageLocale) {
  return {
    type: CHANGE_LOCALE,
    locale: languageLocale,
  };
}

export function changeLanguageInDB(languageLocale) {
  return {
    type: SUBMIT_LANGUAGE,
    languageLocale,
  };
}

export function setErrors(payload) {
  return {
    type: SET_ERRORS,
    payload,
  };
}
