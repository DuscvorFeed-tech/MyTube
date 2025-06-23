import { call, put, takeLatest } from 'redux-saga/effects';
import { NativeAPIAuthorizedGet } from 'utils/request';
import { config } from 'utils/config';
import { CONFIRM_EMAIL } from './constants';
import { confirmSuccess } from './actions';

export function* confirmEmail(data) {
  const requestURL = `${config.CONFIRM_EMAIL}?key=${
    data.data.key
  }&confirmationcode=${data.data.confirmcode}`;

  const repos = yield call(NativeAPIAuthorizedGet, requestURL);

  if (repos && repos.success === true) {
    yield put(confirmSuccess(true));
  } else {
    yield put(confirmSuccess(false));
  }
}

// Individual exports for testing
export default function* confirmForgotPasswordEmailFailPageSaga() {
  yield takeLatest(CONFIRM_EMAIL, confirmEmail);
}
