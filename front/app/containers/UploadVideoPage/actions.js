/*
 *
 * RegisterPage actions
 *
 */

import {
  DEFAULT_ACTION,
  SUBMIT_UPLOAD,
  SET_ERRORS,
  SUBMIT_UPLOAD_SUCCESS,
  VIDEO_PROCESS,
  VIDEO_PROCESS_SUCCESS,
  LOAD_THUMBNAIL,
  LOAD_CATEGORY,
  LOAD_CATEGORY_SUCCESS,
  SET_CATEGORY,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function submitUpload(payload, onSubmitted) {
  return {
    type: SUBMIT_UPLOAD,
    payload,
    onSubmitted,
  };
}

export function setErrors(errors) {
  return {
    type: SET_ERRORS,
    errors,
  };
}

export function submitUploadSuccess() {
  return {
    type: SUBMIT_UPLOAD_SUCCESS,
  };
}

export function videoProcess(videoFile) {
  return {
    type: VIDEO_PROCESS,
    videoFile,
  };
}

export function videoProcessSuccess(response) {
  return {
    type: VIDEO_PROCESS_SUCCESS,
    response,
  };
}

export function loadThumbnail(filename) {
  return {
    type: LOAD_THUMBNAIL,
    filename,
  };
}

export function loadCategory() {
  return {
    type: LOAD_CATEGORY,
  };
}

export function loadCategorySuccess(categories) {
  return {
    type: LOAD_CATEGORY_SUCCESS,
    categories,
  };
}

export function setCategory(categoryId) {
  return {
    type: SET_CATEGORY,
    categoryId,
  };
}
