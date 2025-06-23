import { takeLatest, call, put } from 'redux-saga/effects';
import { modalToggler } from 'utils/commonHelper';
import { FormUploadAPI } from 'utils/request';
import { config } from 'utils/config';
import { SUBMIT_FORM } from './constants';
import { setErrors, removeImageHeader } from './actions';

// Individual exports for testing
export default function* addFormPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(SUBMIT_FORM, submitForm);
}

function* submitForm({ payload, onSubmitted }) {
  const formImageHeader = document.getElementById('formImagePreview');
  const file = document.getElementById('imageInput');
  const imageHeader =
    file == null || formImageHeader == null ? null : file.files[0];

  const formData = new FormData();
  formData.append('Content-Type', 'multipart/form-data');
  if (imageHeader != null) {
    formData.append('imageHeader', imageHeader);
  }

  Object.keys(payload).forEach(key => {
    if (key === 'imageHeader' && imageHeader !== null) {
      return;
    }
    formData.append(key, payload[key]);
  });

  const result = yield call(submitFormWithImage, {
    url: config.CREATE_TEMPLATE_FORM,
    formData,
  });

  if (result.success) {
    modalToggler('AddFormSuccess');
    yield put(setErrors(result.errors));
  } else {
    yield put(setErrors(result.errors));
  }

  yield call(removeImageHeader);
  yield call(onSubmitted, true);
}

function submitFormWithImage({ url, formData }) {
  return FormUploadAPI(url, formData);
}
