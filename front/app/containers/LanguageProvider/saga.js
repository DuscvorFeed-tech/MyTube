/* eslint-disable camelcase */
import { takeLatest, call } from 'redux-saga/effects';
import { GraphqlAPI, Authorization } from '../../utils/request';
import { forwardTo } from '../../helpers/forwardTo';
import PATH from '../path';
import { SUBMIT_LANGUAGE } from './constants';

export default function* changeLanguagePageSaga() {
  yield takeLatest(SUBMIT_LANGUAGE, submitLanguage);
}

function* submitLanguage(payload) {
  const language = payload.languageLocale.data;
  const data = yield call(changeLanguage, language);
  if (data.success) {
    yield call(forwardTo, PATH.PROFILE);
  } else {
    // TODO: Error Handling
  }
}

function changeLanguage(language) {
  const query = {
    query: `
    mutation {
      ChangeLanguage(languageInput: "${language}")
    }`,
  };
  return GraphqlAPI(query, Authorization);
}
