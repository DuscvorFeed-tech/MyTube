/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
import { takeLatest, call, put } from 'redux-saga/effects';
import AdminStorage from 'utils/AdminLocal';
import { config } from 'utils/config';
import { NativeAPI } from '../../utils/request';
import RequestIP from '../../utils/requestIP';
import { SUBMIT_LOGIN } from './constants';
import { setErrors } from './actions';
import { forwardTo } from '../../helpers/forwardTo';
import PATH from '../path';

export default function* loginPageSaga() {
  
  // See example in containers/HomePage/saga.js
  yield takeLatest(SUBMIT_LOGIN, submitLogin);
}

function* submitLogin({ payload, onSubmitted }) {
  
  const formData = new FormData();
  formData.append('EmailUsername', payload.emailUsername);
  formData.append('Password', payload.password);

  const apiResponse = yield call(NativeAPI, formData, config.USER_LOGIN_ROUTE);

  if (apiResponse && apiResponse.success === true) {

    AdminStorage.logout();
    yield call(getIPAddress);
    yield call(AdminStorage.successfulLogin, apiResponse.data);
    yield call(forwardTo, PATH.HOME);
    
  } else {    

    yield put(setErrors(apiResponse.errors));
    yield call(onSubmitted, true);

  }

}

const getIPAddress = async() => {
  const myip = await RequestIP.getIPAddress();
  console.log(myip);
  AdminStorage.setIPAddress(myip);
}