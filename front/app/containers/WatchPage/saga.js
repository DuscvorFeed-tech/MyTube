/**
 * Gets the repositories of the user from Github
 */

import { call, put, takeLatest } from 'redux-saga/effects';
import AdminStorage from 'utils/AdminLocal';
import { NativeAPIAuthorizedGet, NativeAPI } from 'utils/request';
import { config } from 'utils/config';
import { loadVideoDetailSuccess, loadVideoDetailError } from './actions';
import { LOAD_VIDEO_DETAIL } from './constants';
// import { makeSelectUsername } from 'containers/HomePage/selectors';

/**
 * Github repos request/response handler
 */
export function* loadVideoDetail(hash) {
  // Select username from store
  // const username = yield select(makeSelectUsername());
  const token = AdminStorage.getTokenInfo();
  const requestURL = `${config.VIDEO_DETAIL}?v=${hash.hash}`;
  const getIp = AdminStorage.getIPAddress();
  const formData = new FormData();
  formData.append('hash', hash.hash);
  formData.append('ipAddress', getIp);
console.log(requestURL);
  // post video view
  //yield call(NativeAPI, formData, config.VIDEO_VIEW_ROUTE);
  const repos = yield call(NativeAPIAuthorizedGet, requestURL);

  if (repos && repos.success === true) {
    yield put(loadVideoDetailSuccess(repos.data));
  } else {
    yield put(loadVideoDetailError(repos.errors));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* githubData() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(LOAD_VIDEO_DETAIL, loadVideoDetail);
}
