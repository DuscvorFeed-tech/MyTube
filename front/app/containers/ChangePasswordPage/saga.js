import { takeLeading, call, put } from 'redux-saga/effects';
import { Authorization, GraphqlAPI } from 'utils/request';
import { forwardTo } from 'helpers/forwardTo';
import { SUBMIT_CHANGE_PASSWORD } from './constants';
import PATH from '../path';
import { setErrors } from './actions';

// Individual exports for testing
export default function* changePasswordPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLeading(SUBMIT_CHANGE_PASSWORD, submitChangePassword);
}

function* submitChangePassword({ payload, onSubmitted }) {
  const data = yield call(changePassword, payload);
  yield call(onSubmitted, true);
  if (data.success) {
    yield call(forwardTo, PATH.SENT_CHANGE_PASSWORD);
  } else {
    yield put(setErrors(data.errors));
  }
}

function changePassword({ currentPassword, newPassword, confirmPassword }) {
  const mutation = {
    query: `
    mutation{
      ChangePassword(userInput: {
        currentPassword: "${currentPassword}"
        newPassword: "${newPassword}"
        confirmPassword: "${confirmPassword}"
       
     })
    }`,
  };
  return GraphqlAPI(mutation, Authorization);
}
