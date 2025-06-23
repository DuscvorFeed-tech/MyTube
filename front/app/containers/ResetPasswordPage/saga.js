import { takeLatest, call, put } from 'redux-saga/effects';
import { VALIDATE_CODE, SUBMIT_PASSWORD } from './constants';
import { GraphqlAPI, Authorization } from '../../utils/request';
import { setLoading, setErrors } from './actions';
import PATH from '../path';
import { forwardTo } from '../../helpers/forwardTo';
import AdminLocal from '../../utils/AdminLocal';

// Individual exports for testing
export default function* resetPasswordPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(VALIDATE_CODE, validateCode);
  yield takeLatest(SUBMIT_PASSWORD, submitPassword);
}

function* validateCode({ payload }) {
  // const loginForm = yield select(makeSelectLoginForm());
  const { success, ValidateResetPasswordCode } = yield call(
    ValidateResetPassCode,
    payload,
  );
  if (success && ValidateResetPasswordCode) {
    yield put(setLoading(false));
    // yield call(AdminStorage.successfulLogin, data.login);
  } else {
    yield call(forwardTo, PATH.RESET_PASSWORD_EXPIRED);
  }
  // yield call(onSubmitted, true);
}

function ValidateResetPassCode({ resetCode }) {
  const query = {
    query: `
    query {
      ValidateResetPasswordCode(resetCode:"${resetCode}")
    }`,
  };
  return GraphqlAPI(query);
}

function* submitPassword({ payload, onSubmitted }) {
  const firstLogin = AdminLocal.isForResetPassword();
  const data = firstLogin
    ? yield call(changePassword, payload)
    : yield call(ConfirmResetPassword, payload);

  if (data.success) {
    yield call(forwardTo, PATH.RESET_PASSWORD_SUCCESS);
  } else {
    yield put(setErrors(data.errors));
    yield call(onSubmitted, true);
  }
}

function ConfirmResetPassword({ newPassword, confirmPassword, resetCode }) {
  const query = {
    query: `
    mutation {
      ConfirmResetPassword(userInput: {
        newPassword: "${newPassword}"
        confirmPassword: "${confirmPassword}"
        resetCode: "${resetCode}"
      })
    }`,
  };
  return GraphqlAPI(query);
}

function changePassword({ newPassword, confirmPassword }) {
  const query = {
    query: `
    mutation {
      ResetPasswordFirstLogin(userInput: {
        newPassword: "${newPassword}"
        confirmPassword: "${confirmPassword}"
      })
    }`,
  };
  return GraphqlAPI(query, Authorization);
}
