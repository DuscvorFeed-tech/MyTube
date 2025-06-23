/* eslint-disable prefer-template */
/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { takeLatest, call, put, select } from 'redux-saga/effects';
import { modalToggler } from 'utils/commonHelper';
import { config } from 'utils/config';
import { NativeAPI, NativeAPIAuthorizedGet, NativeAPIFormData } from '../../utils/request';
import { SUBMIT_UPLOAD, VIDEO_PROCESS, LOAD_THUMBNAIL, LOAD_CATEGORY } from './constants';
import { setErrors, submitUploadSuccess, videoProcessSuccess, loadCategorySuccess } from './actions';
import { makeSelectCategoryID, makeSelectVideoResponse } from './selectors';


export default function* uploadVideoPageSaga() {
  
  yield takeLatest(SUBMIT_UPLOAD, submitUpload);
  yield takeLatest(VIDEO_PROCESS, videoProcess);
  yield takeLatest(LOAD_THUMBNAIL, loadThumbnail);
  yield takeLatest(LOAD_CATEGORY, loadCategories);
}

function* submitUpload({ payload, onSubmitted }) {
  const videoResponse = yield select(makeSelectVideoResponse());
  let videoCategoryId = yield select(makeSelectCategoryID());
  // eslint-disable-next-line radix
  videoCategoryId = parseInt(videoCategoryId);
  const formData = new FormData();

  // if (payload.videoFile) {
  //  formData.append('VideoFile', payload.videoFile);
  // }
  formData.append('videoFileName', videoResponse.data.videoFileName);
  formData.append('Thumbnail1', videoResponse.data.thumbnails[0]);
  formData.append('Thumbnail2', videoResponse.data.thumbnails[1]);
  formData.append('Thumbnail3', videoResponse.data.thumbnails[2]);
  formData.append('Title', payload.title);
  formData.append('Description', payload.description);
  formData.append('videoThumbnail', payload.videoThumbnail);
  formData.append('VideoType', 1);
  formData.append('paidContent', true);
  formData.append('PaidContentPrice', 200);
  formData.append('PaidContentFilPrice', 0.15);
  formData.append('antiForgeryLicense', (payload.antiForgeryLicense === true) ? 1 : 0);
  formData.append('customVideoThumbnail', payload.customVideoThumbnail);
  //formData.append('videoThumbnail', payload.customVideoThumbnail);
  const apiResponse = yield call(NativeAPIFormData, formData, config.UPLOAD_VIDEO_ROUTE);
  
  if (apiResponse && apiResponse.success === true) {
    yield put(submitUploadSuccess());
    modalToggler('videoUploadSuccess');

  } else {    

    yield put(setErrors(apiResponse.errors));
    yield call(onSubmitted, true);

  }
  
}

function* videoProcess(videoFile) {
  const formData = new FormData();

  if (videoFile.videoFile) {
    formData.append('VideoFile', videoFile.videoFile);
  }

  const apiResponse = yield call(NativeAPIFormData, formData, config.PROCESS_VIDEO_ROUTE);
  
  if (apiResponse && apiResponse.success === true) {
    yield put(videoProcessSuccess(apiResponse));
  } else {    
    yield put(setErrors(apiResponse.errors));
  }
}

function* loadThumbnail(filename) {
  const requestURL = `${config.LOAD_THUMBNAIL}/${filename.filename}`;

  const apiResponse = yield call(NativeAPIAuthorizedGet, requestURL);
  if (apiResponse && apiResponse.success === true) {
    return requestURL;
  }
  return '';
}

function* loadCategories() {
  const requestURL = `/video/category`;

  const apiResponse = yield call(NativeAPIAuthorizedGet, requestURL);
  if (apiResponse && apiResponse.success === true) {
    yield put(loadCategorySuccess(apiResponse));
  }
}