import { takeLatest, call, put } from 'redux-saga/effects';
import { VERIFY_TWITTER } from './constants';
import { Authorization, GraphqlAPI } from '../../utils/request';
import { forwardTo } from '../../helpers/forwardTo';
import PATH from '../path';
import { setErrors } from './actions';

// Individual exports for testing
export default function* linkSnsPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(VERIFY_TWITTER, submitVerifyTwitter);
}

function* submitVerifyTwitter({ payload }) {
  const data = yield call(verifySNSAccount, payload);

  if (data.success && data.VerifySNSAccount) {
    yield call(forwardTo, {
      pathname: PATH.SETTINGS_ACCOUNTS,
      state: { isLinked: true },
    });
  } else if (data.errors) {
    yield put(setErrors(data.errors));
  } else {
    yield call(forwardTo, PATH.ADD_ACCOUNT);
  }
}

function verifySNSAccount({ requestToken, verifierToken, type }) {
  const query = {
    query: `
    mutation{
      VerifySNSAccount(
        snsType: ${type},
        snsVerifier:{
        requestToken:"${requestToken}",
        verifierToken:"${verifierToken}"   
      })
    }`,
  };
  return GraphqlAPI(query, Authorization);
}
