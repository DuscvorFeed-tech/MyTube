// import { take, call, put, select } from 'redux-saga/effects';
import { takeLatest, call, put } from 'redux-saga/effects';
import { config } from 'utils/config';
import { modalToggler } from 'utils/commonHelper';
import { LOAD_SNS_ACCOUNTS, SUBMIT_REGISTER } from './constants';
import { loadedSNSAccounts, snsError } from './actions';
import { NativeAPI, NativeAPIAuthorizedGet } from '../../utils/request';
// Individual exports for testing
export default function* profilePageSaga() {
  yield takeLatest(LOAD_SNS_ACCOUNTS, getSnsAccounts);
  yield takeLatest(SUBMIT_REGISTER, submitRegister);
}

export function* getSnsAccounts() {
  const apiResponse = yield call(
    NativeAPIAuthorizedGet,
    config.GET_SNS_ACCOUNTS,
  );

  if (apiResponse && apiResponse.success === true) {
    yield put(loadedSNSAccounts(apiResponse.record));
  } else {
    yield put(snsError(apiResponse.errors));
  }
}

function* submitRegister({ payload, onSubmitted }) {
  const formData = new FormData();
  formData.append('facebook', payload.facebook);
  formData.append('twitter', payload.twitter);
  formData.append('instagram', payload.instagram);
  formData.append('youtube', payload.youtube);

  const apiResponse = yield call(NativeAPI, formData, config.SAVE_SNS_ACCOUNTS);
  if (apiResponse && apiResponse.success === true) {
    modalToggler('updateSuccess');
  } else {
    // yield put(setErrors(apiResponse.errors));
    yield call(onSubmitted, true);
  }
}
