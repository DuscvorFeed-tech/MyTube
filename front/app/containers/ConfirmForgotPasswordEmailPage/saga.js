import { call, takeLatest } from 'redux-saga/effects';
import { NativeAPIAuthorizedGet } from 'utils/request';
import { config } from 'utils/config';
import { CONFIRM_KEY_CONFIRMATION_CODE } from './constants';
import { forwardTo } from '../../helpers/forwardTo';

export default function* confirmForgotPasswordEmailPageSaga() {
  yield takeLatest(
    CONFIRM_KEY_CONFIRMATION_CODE,
    confirmKeyAndConfirmationCode,
  );
}

function* confirmKeyAndConfirmationCode(data) {
  const requestURL = `${config.USER_FORGOT_PASSWORD_CONFIRMATION_ROUTE}?key=${
    data.data.key
  }&confirmationcode=${data.data.confirmcode}`;

  const response = yield call(NativeAPIAuthorizedGet, requestURL);

  if (response && response.success === true) {
    forwardTo(
      `/forgotpassword/change/${response.data.key}/${response.data.resetCode}`,
    );
  } else {
    forwardTo('/password/forgot/confirmation/fail');
  }
}
