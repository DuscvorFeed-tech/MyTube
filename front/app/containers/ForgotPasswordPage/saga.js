import { takeLatest, call, put } from 'redux-saga/effects';
import { modalToggler } from 'utils/commonHelper';
import { config } from 'utils/config';
import { SUBMIT_FORGOT_PASSWORD } from './constants';
import { NativeAPI } from '../../utils/request';
import {
  submitForgotPasswordError,
  submitForgotPasswordSuccess,
} from './actions';

// Individual exports for testing
export default function* forgotPasswordPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(SUBMIT_FORGOT_PASSWORD, submitForgotPassword);
}

function* submitForgotPassword({ payload, onSubmitted }) {
  const formData = new FormData();
  formData.append('Email', payload.email);
  formData.append('Locale', payload.locale);

  const apiResponse = yield call(NativeAPI, formData, config.FORGOT_PASSWORD);

  if (apiResponse && apiResponse.success === true) {
    yield put(submitForgotPasswordSuccess());
    modalToggler('ForgotSuccess');
  } else {
    yield put(submitForgotPasswordError(apiResponse.errors));
    yield call(onSubmitted, true);
  }
}
