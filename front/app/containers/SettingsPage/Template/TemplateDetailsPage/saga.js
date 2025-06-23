import { takeLatest, call, put } from 'redux-saga/effects';
import { modalToggler } from 'utils/commonHelper';
import { GraphqlAPI, Authorization, FormUploadUpdateAPI } from 'utils/request';
import { config } from 'utils/config';
import PATH from 'containers/path';
import { forwardTo } from 'helpers/forwardTo';
import { FETCH_TEMPLATE_DETAIL, UPDATE_TEMPLATE } from './constants';
import { setTemplateDetail, setErrors, setData } from './actions';

// Individual exports for testing
export default function* templateDetailsPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(FETCH_TEMPLATE_DETAIL, fetchTemplateDetail);
  yield takeLatest(UPDATE_TEMPLATE, updateTemplate);
}

function* fetchTemplateDetail({ id }) {
  const data = yield call(messageTemplateById, id);
  if (data.success && data.MessageTemplateById) {
    yield put(setTemplateDetail(data.MessageTemplateById));
  } else {
    yield call(forwardTo(PATH.PAGE404));
  }
}

function* updateTemplate({ payload, onSubmitted }) {
  let result;
  const { file } = payload;
  const formData = new FormData();

  Object.keys(payload).forEach(key => {
    formData.append(key, payload[key]);
  });
  formData.delete('file'); // to replace file key with new key

  if (file === null) {
    formData.append('messageImage', file);
    result = yield call(submitTemplateWithFile, {
      url: `${config.UPDATE_MESSAGE_TEMPLATE}/${payload.id}`,
      formData,
    });
  }

  if (file) {
    if (typeof file !== 'string') {
      if (
        file.type.includes('jpeg') ||
        file.type.includes('jpg') ||
        file.type.includes('png')
      ) {
        formData.append('messageImage', file);
        result = yield call(submitTemplateWithFile, {
          url: `${config.UPDATE_MESSAGE_TEMPLATE}/${payload.id}`,
          formData,
        });
      }
      if (file.type.includes('gif')) {
        formData.append('gif', file);
        result = yield call(submitTemplateWithFile, {
          url: `${config.UPDATE_MESSAGE_TEMPLATE_GIF}/${payload.id}`,
          formData,
        });
      }
      if (file.type.includes('video')) {
        formData.append('video', file);
        result = yield call(submitTemplateWithFile, {
          url: `${config.UPDATE_MESSAGE_TEMPLATE_VIDEO}/${payload.id}`,
          formData,
        });
      }
    } else {
      result = yield call(submitTemplateWithFile, {
        url: `${config.UPDATE_MESSAGE_TEMPLATE}/${payload.id}`,
        formData,
      });
    }
  }

  if (result.success) {
    modalToggler('EditSuccess');
  } else {
    yield put(setData('isEdit', true));
    yield put(setErrors(result.errors));
  }

  yield call(onSubmitted, true);
}

function messageTemplateById(id) {
  const query = {
    query: `
    query{
      MessageTemplateById(id:${id}){
          id
          name
          type
          description
          category
          content
          message_file
      }
    }`,
  };
  return GraphqlAPI(query, Authorization);
}

function submitTemplateWithFile({ url, formData }) {
  return FormUploadUpdateAPI(url, formData);
}
