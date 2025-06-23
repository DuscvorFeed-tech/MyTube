import { call, takeLatest } from 'redux-saga/effects';
import { NativeAPIAuthorizedGet } from 'utils/request';
import { config } from 'utils/config';
import { CONFIRM_EMAIL } from './constants';
import { forwardTo } from '../../helpers/forwardTo';

export function* confirmEmail(data) {
  const requestURL = `${config.USER_SIGNUP_CONFIRMATION_ROUTE}?key=${
    data.data.key
  }&confirmationcode=${data.data.confirmcode}`;

  const repos = yield call(NativeAPIAuthorizedGet, requestURL);

  if (repos && repos.success === true) {
    forwardTo('/register/confirm/success');
  } else {
    forwardTo('/register/confirm/fail');
  }
}

// Individual exports for testing
export default function* confirmEmailPageSaga() {
  yield takeLatest(CONFIRM_EMAIL, confirmEmail);
}
