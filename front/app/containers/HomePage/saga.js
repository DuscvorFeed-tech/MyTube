/**
 * Gets the repositories of the user from Github
 */

import { call, put, takeLatest } from 'redux-saga/effects';
import { config } from 'utils/config';
import { LOAD_VIDEOS } from './constants';
import {
  videoLoaded,
  videoError,
  setNewVideos,
  setFeaturedVideos,
  setGirlsDJVideos,
  setEDMVideos,
} from './actions';
import { makeSelectMenu } from './selectors';
import { NativeAPIAuthorizedGet } from '../../utils/request';

export function* getVideos() {
  const menu = yield makeSelectMenu();
  const url = config.GET_ALL_VIDEOS_ROUTE;
  if (menu === 'trending') {
    let url = config.GET_TRENDING_VIDEOS_ROUTE;
  }
  const apiResponse = yield call(
    NativeAPIAuthorizedGet,
    `${url}?recordPerPage=20&orderType=2`,
  );

  if (apiResponse && apiResponse.success === true) {
    yield put(videoLoaded(apiResponse.data));
  } else {
    yield put(videoError(apiResponse.errors));
  }
}

function* getNewVideos() {
  const apiResponse = yield call(
    NativeAPIAuthorizedGet,
    `${config.GET_NEW_VIDEOS_ROUTE}?recordPerPage=8`,
  );

  if (apiResponse && apiResponse.success === true) {
    yield put(setNewVideos(apiResponse.data));
  }
}

function* getFeaturedVideos() {
  const apiResponse = yield call(
    NativeAPIAuthorizedGet,
    `${config.GET_TRENDING_VIDEOS_ROUTE}?recordPerPage=1000000`,
  );

  if (apiResponse && apiResponse.success === true) {
    const listLength = apiResponse.data.length;
    const id1 = Math.floor(Math.random() * listLength);
    let id2 = Math.floor(Math.random() * listLength);
    while (id2 === id1) {
      id2 = Math.floor(Math.random() * listLength);
    }
    const randomItems = [];
    randomItems.push(apiResponse.data[id1]);
    randomItems.push(apiResponse.data[id2]);
    yield put(setFeaturedVideos(randomItems));
  }
}

function* getGirlsDJVideos() {
  const apiResponse = yield call(
    NativeAPIAuthorizedGet,
    `${config.GET_ALL_VIDEOS_ROUTE}?recordPerPage=8&videoCategoryId=6`,
  );

  if (apiResponse && apiResponse.success === true) {
    yield put(setGirlsDJVideos(apiResponse.data));
  }
}

function* getEDMVideos() {
  const apiResponse = yield call(
    NativeAPIAuthorizedGet,
    `${config.GET_ALL_VIDEOS_ROUTE}?recordPerPage=8&videoCategoryId=1`,
  );

  if (apiResponse && apiResponse.success === true) {
    yield put(setEDMVideos(apiResponse.data));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* githubData() {
  yield takeLatest(LOAD_VIDEOS, getVideos);
}
