import { takeLatest, call } from 'redux-saga/effects';
import { Authorization, GraphqlAPI } from 'utils/request';
import { CONFIRM_CHANGE_EMAIL } from './constants';

// Individual exports for testing
export default function* activateCompletePageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(CONFIRM_CHANGE_EMAIL, submitConfirmChangeEmail);
}

function* submitConfirmChangeEmail({ payload, onSubmitted }) {
  const data = yield call(confirmChangeEmail, payload);
  if (data.success) {
    yield call(onSubmitted, true);
  } else {
    yield call(onSubmitted, false);
  }
}

function confirmChangeEmail({ changeEmailCode }) {
  const mutation = {
    query: `
    mutation{
      ConfirmChangeEmail(changeEmailCode: "${changeEmailCode}")
    }`,
  };
  return GraphqlAPI(mutation, Authorization);
}
