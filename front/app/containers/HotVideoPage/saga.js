import { call, put, takeLatest, select } from 'redux-saga/effects';
import { config } from 'utils/config';
import { LOAD_VIDEOS } from './constants';
import { videoLoaded, videoError } from './actions';
import { NativeAPIAuthorizedGet } from '../../utils/request';
import { makeSelectKeyword } from './selectors';

// Individual exports for testing
export default function* hotVideoPageSaga() {
  yield takeLatest(LOAD_VIDEOS, getVideos);
}

export function* getVideos() {
  const keyword = yield select(makeSelectKeyword());
  const url = `${config.GET_TRENDING_VIDEOS_ROUTE}?keyword=${keyword || ''}`;

  const apiResponse = yield call(NativeAPIAuthorizedGet, url);

  if (apiResponse && apiResponse.success === true) {
    yield put(videoLoaded(apiResponse.list));
  } else {
    yield put(videoError(apiResponse.errors));
  }
}
