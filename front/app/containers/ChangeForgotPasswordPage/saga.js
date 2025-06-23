import { takeLatest, call, put } from 'redux-saga/effects';
import { modalToggler } from 'utils/commonHelper';
import { config } from 'utils/config';
import { NativeAPI } from '../../utils/request';
import { SUBMIT_REGISTER } from './constants';
import { setErrors } from './actions';

export default function* changeForgotPasswordPageSaga() {
  yield takeLatest(SUBMIT_REGISTER, submitCreate);
}

function* submitCreate({ payload, onSubmitted }) {
  const formData = new FormData();
  formData.append('Key', payload.key);
  formData.append('ResetCode', payload.resetcode);
  formData.append('Password', payload.password);
  formData.append('ConfirmPassword', payload.confirmPassword);

  const apiResponse = yield call(
    NativeAPI,
    formData,
    config.USER_RESET_PASSWORD_ROUTE,
  );

  if (apiResponse && apiResponse.success === true) {
    modalToggler('changeForgotPasswordSuccess');
  } else {
    yield put(setErrors(apiResponse.errors));
    yield call(onSubmitted, true);
  }
}
