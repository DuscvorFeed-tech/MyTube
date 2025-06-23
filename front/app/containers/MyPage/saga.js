import { call, put, takeLatest } from 'redux-saga/effects';
import { config } from 'utils/config';
import { LOAD_VIDEOS } from './constants';
import { videoLoaded, videoError } from './actions';
import { NativeAPIAuthorizedGet } from '../../utils/request';

// Individual exports for testing
export default function* MyPageSaga() {
  yield takeLatest(LOAD_VIDEOS, getVideos);
}

export function* getVideos() {
  const apiResponse = yield call(
    NativeAPIAuthorizedGet,
    `${config.USER_UPLOADED_VIDEO_ROUTE}?recordPerPage=1000`,
  );

  if (apiResponse && apiResponse.success === true) {
    yield put(videoLoaded(apiResponse.list));
  } else {
    yield put(videoError(apiResponse.errors));
  }
}
