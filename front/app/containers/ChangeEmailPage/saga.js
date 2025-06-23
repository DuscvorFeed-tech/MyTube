import { takeLeading, call, put } from 'redux-saga/effects';
import { Authorization, GraphqlAPI } from 'utils/request';
import { forwardTo } from 'helpers/forwardTo';
import { SUBMIT_CHANGE_EMAIL } from './constants';
import PATH from '../path';
import { setErrors } from './actions';
// Individual exports for testing
export default function* changeEmailPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLeading(SUBMIT_CHANGE_EMAIL, submitChangeEmail);
}

function* submitChangeEmail({ payload, onSubmitted }) {
  const data = yield call(changeEmail, payload);
  yield call(onSubmitted, true);
  if (data.success) {
    yield call(forwardTo, PATH.SENT_CHANGE_EMAIL);
  } else {
    yield put(setErrors(data.errors));
  }
}

function changeEmail({ password, newEmail, confirmEmail }) {
  const mutation = {
    query: `
    mutation{
      ChangeEmail(changeEmailInput: {
       newEmail: "${newEmail}"
       confirmEmail: "${confirmEmail}"
       password: "${password}"
       
     })
    }`,
  };
  return GraphqlAPI(mutation, Authorization);
}
