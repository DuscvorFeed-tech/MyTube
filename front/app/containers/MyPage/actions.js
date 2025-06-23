/*
 *
 * MyPage actions
 *
 */

import {
  DEFAULT_ACTION,
  LOAD_VIDEOS,
  LOADED_VIDEO,
  ERROR_VIDEO,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function loadVideos(keyword) {
  return {
    type: LOAD_VIDEOS,
    keyword,
  };
}

export function videoLoaded(response) {
  return {
    type: LOADED_VIDEO,
    response,
  };
}

export function videoError(error) {
  return {
    type: ERROR_VIDEO,
    error,
  };
}
