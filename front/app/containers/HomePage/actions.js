import {
  LOAD_VIDEOS,
  LOADED_VIDEO,
  ERROR_VIDEO,
  NEW_VIDEOS,
  FEATURED_VIDEOS,
  GIRLSDJ_VIDEOS,
  EDM_VIDEOS,
} from './constants';

export function loadVideos() {
  return {
    type: LOAD_VIDEOS,
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

export function setNewVideos(response) {
  return {
    type: NEW_VIDEOS,
    response,
  };
}

export function setFeaturedVideos(response) {
  return {
    type: FEATURED_VIDEOS,
    response,
  };
}

export function setGirlsDJVideos(response) {
  return {
    type: GIRLSDJ_VIDEOS,
    response,
  };
}

export function setEDMVideos(response) {
  return {
    type: EDM_VIDEOS,
    response,
  };
}
