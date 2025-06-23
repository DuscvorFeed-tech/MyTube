import { call, put, takeLatest, select } from 'redux-saga/effects';
import { config } from 'utils/config';
import { LOAD_VIDEOS } from './constants';
import { videoLoaded, videoError } from './actions';
import { NativeAPIAuthorizedGet } from '../../utils/request';
import { makeSelectCategoryId } from './selectors';

// Individual exports for testing
export default function* categoryVideoPageSaga() {
  yield takeLatest(LOAD_VIDEOS, getVideos);
}

export function* getVideos() {
  const videoCategoryId = yield select(makeSelectCategoryId());
  const url = `${
    config.GET_ALL_VIDEOS_ROUTE
  }?videoCategoryId=${videoCategoryId || ''}&recordPerPage=1000`;
  // const url = `${config.GET_ALL_VIDEOS_ROUTE}`;

  const apiResponse = yield call(NativeAPIAuthorizedGet, url);

  if (apiResponse && apiResponse.success === true) {
    yield put(videoLoaded(apiResponse.list));
  } else {
    yield put(videoError(apiResponse.errors));
  }
}
