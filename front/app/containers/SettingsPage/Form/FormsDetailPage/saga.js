import { takeLatest, call, put } from 'redux-saga/effects';
import { GraphqlAPI, Authorization, FormUploadUpdateAPI } from 'utils/request';
import { config } from 'utils/config';
import { modalToggler } from 'utils/commonHelper';
import { forwardTo } from 'helpers/forwardTo';
import PATH from 'containers/path';
import { UPDATE_FORM, FETCH_FORM_DETAILS } from './constants';
import { setErrors, setFormDetails, setData } from './actions';

// Individual exports for testing
export default function* formsDetailPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(UPDATE_FORM, updateForm);
  yield takeLatest(FETCH_FORM_DETAILS, fetchFormDetails);
}

function* updateForm({ payload, onSubmitted }) {
  const file = document.getElementById('imageInput');
  const imageHeader = file == null ? null : file.files[0];
  const imageExist = document.getElementById('formImagePreview');
  let isImageDeleted;
  if (imageExist) {
    isImageDeleted = false;
  } else {
    isImageDeleted = true;
  }

  const formDetails = new FormData();
  formDetails.append('Content-Type', 'multipart/form-data');
  if (imageHeader != null) {
    formDetails.append('imageHeader', imageHeader);
  }
  formDetails.append('isImageDeleted', isImageDeleted);

  Object.keys(payload).forEach(key => {
    if (key === 'imageHeader' && imageHeader !== null) {
      return;
    }
    formDetails.append(key, payload[key]);
  });

  const result = yield call(submitFormWithImage, {
    url: `${config.UPDATE_TEMPLATE_FORM}/${payload.id}`,
    formDetails,
  });

  if (result.success) {
    modalToggler('EditSuccess');
  } else {
    yield put(setData('isEdit', true));
    yield put(setErrors(result.errors));
  }

  yield call(onSubmitted, true);
}

function* fetchFormDetails(id) {
  const data = yield call(formData, id.id);
  if (data.success) {
    yield put(setFormDetails(data.TemplateFormsById));
  } else {
    yield call(forwardTo(PATH.PAGE404));
  }
}

function formData(id) {
  const query = {
    query: `query{
      TemplateFormsById(id:${id}){
          id
          name
          description
          content
          footer
          title
          imageHeader
      }
    }`,
  };
  return GraphqlAPI(query, Authorization);
}

function submitFormWithImage({ url, formDetails }) {
  return FormUploadUpdateAPI(url, formDetails);
}
