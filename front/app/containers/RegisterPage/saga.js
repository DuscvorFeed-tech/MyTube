/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
import { takeLatest, call, put, select } from 'redux-saga/effects';
import AdminStorage from 'utils/AdminLocal';
import { modalToggler } from 'utils/commonHelper';
import { config } from 'utils/config';
import { NativeAPI } from '../../utils/request';
import { SUBMIT_REGISTER } from './constants';
import { setErrors } from './actions';
import { makeSelectUserType } from './selectors';


export default function* registerPageSaga() {
  
  yield takeLatest(SUBMIT_REGISTER, submitRegister);

}

function* submitRegister({ payload, onSubmitted }) {
  let selectedUserTypeId = yield select(makeSelectUserType());
  // eslint-disable-next-line radix
  selectedUserTypeId = parseInt(selectedUserTypeId);
  const formData = new FormData();
  formData.append('Username', payload.username);
  formData.append('Email', payload.email);
  formData.append('Password', payload.password);
  formData.append('ConfirmPassword', payload.confirmPassword);
  formData.append('UserType',selectedUserTypeId)
  formData.append('Agree', payload.agree);
  formData.append('Locale', payload.locale);
  formData.append('LocaleType', 2);
  formData.append('SecuredFileTransfer', payload.securedFileTransfer);

  const apiResponse = yield call(NativeAPI, formData, config.USER_SIGNUP_ROUTE);
  if (apiResponse && apiResponse.success === true) {

    AdminStorage.logout();
    modalToggler('userForConfirmation');

  } else {    

    yield put(setErrors(apiResponse.errors));
    yield call(onSubmitted, true);

  }
  
}
