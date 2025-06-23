/* eslint-disable camelcase */
import { takeLatest, call, put } from 'redux-saga/effects';
import { modalToggler } from 'utils/commonHelper';
import { setErrors } from './actions';
import { SUBMIT_LABEL } from './constants';
import { GraphqlAPI, Authorization } from '../../../../utils/request';

// Individual exports for testing
export default function* addLabelPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(SUBMIT_LABEL, submitLabel);
}

function* submitLabel({ payload, onSubmitted }) {
  const data = yield call(createLabel, payload);
  if (data.success && data.CreateLabel) {
    modalToggler('AddLabelSuccess');
  } else {
    yield put(setErrors(data.errors));
  }
  yield call(onSubmitted, true);
}

function createLabel({ name, color_code }) {
  const query = {
    query: `
    mutation{
      CreateLabel(createLabelInput:{
        name:"${name}",
        color_code:"${color_code}"
      })
    }`,
  };
  return GraphqlAPI(query, Authorization);
}
