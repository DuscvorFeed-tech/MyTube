import { takeLatest, call, put } from 'redux-saga/effects';
import { modalToggler } from 'utils/commonHelper';
import { config } from 'utils/config';
import { NativeAPI, GraphqlAPI } from 'utils/request';
import { FETCH_COMMON_TYPES, SUBMIT_TEMPLATE } from './constants';
import { setCommonTypes, setErrors } from './actions';

// Individual exports for testing
export default function* addTemplatePageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(FETCH_COMMON_TYPES, fetchCommonTypes);
  yield takeLatest(SUBMIT_TEMPLATE, submitTemplate);
}

function* submitTemplate({ data, onSubmitted }) {
  let result;
  const { file } = data;
  const formData = new FormData();

  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });
  formData.delete('file'); // to replace file key with new key

  if (file === null) {
    result = yield call(
      NativeAPI,
      formData,
      config.CREATE_MESSAGE_TEMPLATE,
      true,
    );
  }

  if (file) {
    if (
      file.type.includes('jpeg') ||
      file.type.includes('jpg') ||
      file.type.includes('png')
    ) {
      formData.append('messageImage', file);
      result = yield call(
        NativeAPI,
        formData,
        config.CREATE_MESSAGE_TEMPLATE,
        true,
      );
    }
    if (file.type.includes('gif')) {
      formData.append('gif', file);
      result = yield call(
        NativeAPI,
        formData,
        config.CREATE_MESSAGE_TEMPLATE_GIF,
        true,
      );
    }
    if (file.type.includes('video')) {
      formData.append('video', file);
      result = yield call(
        NativeAPI,
        formData,
        config.CREATE_MESSAGE_TEMPLATE_VIDEO,
        true,
      );
    }
  }

  if (result.success) {
    modalToggler('AddTemplateSuccess');
  } else {
    yield put(setErrors(result.errors));
    yield call(onSubmitted, true);
  }
}

function* fetchCommonTypes() {
  const data = yield call(commontypes);
  if (data.success && data.CommonTypes) {
    yield put(setCommonTypes(data.CommonTypes));
  }
}

function commontypes() {
  const query = {
    query: `
    query {
      CommonTypes {
        type
        data {
          name,
          value
        }
      }
    }`,
  };
  return GraphqlAPI(query);
}
