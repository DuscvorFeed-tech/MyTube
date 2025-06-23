import { takeLeading, takeLatest, call, put } from 'redux-saga/effects';
import { modalToggler } from 'utils/commonHelper';
import {
  FETCH_LABEL_LIST,
  DELETE_LABEL,
  LINK_ACCOUNT,
  FETCH_ACCOUNT_LIST,
  FETCH_FORM_LIST,
  FETCH_TEMPLATE_LIST,
  DELETE_TEMPLATE,
  DELETE_FORM,
  SET_SNS_AS_DEFAULT,
  DELETE_SNS_ACCOUNT,
} from './constants';
import { GraphqlAPI, Authorization } from '../../utils/request';
import {
  setLabels,
  setAccounts,
  setFormList,
  setTemplates,
  setError,
} from './actions';
// import { take, call, put, select } from 'redux-saga/effects';
// Individual exports for testing
export default function* settingsPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(FETCH_LABEL_LIST, fetchLabelList);
  yield takeLeading(DELETE_LABEL, submitDeleteLabel);
  yield takeLatest(LINK_ACCOUNT, linkAccount);
  yield takeLatest(FETCH_ACCOUNT_LIST, fetchAccountList);
  yield takeLatest(FETCH_FORM_LIST, fetchFormList);
  yield takeLatest(FETCH_TEMPLATE_LIST, fetchTemplateList);
  yield takeLeading(DELETE_TEMPLATE, deleteTemplateLabel);
  yield takeLeading(DELETE_FORM, deleteForm);
  yield takeLatest(SET_SNS_AS_DEFAULT, setSnsAsDefult);
  yield takeLeading(DELETE_SNS_ACCOUNT, deleteSnsAccount);
}

function* fetchLabelList(page) {
  const data = yield call(labels, page);
  if (data.success) {
    yield put(setLabels(data.Labels));
  } else {
    // yield put(setErrors(data.errors));
  }
}

function* fetchAccountList(page) {
  const data = yield call(fetchUserAccount, page);
  if (data.success && data.UserSnsAccounts) {
    yield put(setAccounts(data.UserSnsAccounts));
  } else {
    // yield put(setErrors(data.errors));
  }
}

function* fetchFormList(page) {
  const data = yield call(forms, page);
  if (data.success) {
    yield put(setFormList(data.TemplateForms));
  } else {
    // yield put(setErrors(data.errors));
  }
}

function* fetchTemplateList(page) {
  const res = yield call(messageTemplates, page);
  if (res.success) {
    yield put(setTemplates(res.MessageTemplates));
  } else {
    // yield put(setErrors(res.errors));
  }
}

function* submitDeleteLabel({ id }) {
  const data = yield call(deleteLabel, id);
  if (data.success) {
    modalToggler('DeleteLabelSuccess');
    yield fetchLabelList({ page: 1 });
  } else {
    yield put(setError(data.errors));
  }
}

function* deleteTemplateLabel({ id }) {
  const data = yield call(deleteTemplate, id);
  if (data.success) {
    modalToggler('DeleteTemplateSuccess');
    yield fetchTemplateList({ page: 1 });
  } else {
    yield put(setError(data.errors));
  }
}

function* linkAccount({ snsType }) {
  const data = yield call(linkSNSAccount, snsType);
  if (data.success) {
    const { redirectURL } = data.LinkSNSAccount;
    window.location.href = redirectURL;
  }
}

function* deleteForm({ id }) {
  const data = yield call(formDelete, id);
  if (data.success) {
    modalToggler('DeleteFormSuccess');
    yield fetchFormList({ page: 1 });
  } else {
    yield put(setError(data.errors));
  }
}

function formDelete({ id }) {
  const query = {
    query: `
    mutation{
      DeleteTemplateForm(id:${id})
    }
    `,
  };
  return GraphqlAPI(query, Authorization);
}

function* setSnsAsDefult({ id }) {
  const data = yield call(setSnsAccountAsDefault, id);
  if (data.success) {
    yield fetchAccountList({ page: 1 });
  } else {
    yield put(setError(data.errors));
  }
}

function* deleteSnsAccount({ id }) {
  const data = yield call(removeSNSAccount, id);
  if (id.validate && data.success) {
    modalToggler('DeleteConfirm');
  }
  if (id.validate && !data.success) {
    modalToggler('DeleteError');
  }
  if (!id.validate && data.success) {
    modalToggler('DeleteSnsSuccess');
    yield fetchFormList({ page: 1 });
  } else {
    yield put(setError(data.errors));
  }
}

function labels({ page }) {
  const query = {
    query: `
    query{
      Labels(pager:{
        page:${page},
        maxRecord:10
      }){
        list{
          id
        name
        color_code
        }
        pageInfo{
          totalRecords
          totalPage
          currentPage
        }
      }
    }`,
  };
  return GraphqlAPI(query, Authorization);
}

function fetchUserAccount({ page }) {
  const query = {
    query: `
    query{
      UserSnsAccounts(pager:{
        page:${page},
        maxRecord:10
      }){
          sns_account{
            id
            name
            primary
            type
          }
          pageInfo{
            totalRecords
            totalPage
            currentPage
          }
        }
      }`,
  };
  return GraphqlAPI(query, Authorization);
}

function forms({ page }) {
  const query = {
    query: `
    query{
      TemplateForms(pager:{
        page:${page},
        maxRecord:10
      }){
        list{
          id
          name
          description
          content
          title
          footer
          imageHeader
        }
        pageInfo{
          totalRecords
          totalPage
          currentPage
        }
      }
    }`,
  };
  return GraphqlAPI(query, Authorization);
}

function deleteLabel({ id }) {
  const query = {
    query: `
    mutation{
      DeleteLabel(id:${id})
    }`,
  };
  return GraphqlAPI(query, Authorization);
}

function deleteTemplate({ id }) {
  const query = {
    query: `
    mutation{
      DeleteMessageTemplate(id:${id})
    }`,
  };
  return GraphqlAPI(query, Authorization);
}

function linkSNSAccount({ snsType }) {
  const query = {
    query: `
    query{
      LinkSNSAccount(snsType:${snsType}){
        requestToken
        redirectURL
      }
    }`,
  };
  return GraphqlAPI(query, Authorization);
}

function messageTemplates({ page }) {
  const query = {
    query: `
    query{
      MessageTemplates(
        pager:{
          page:${page},
          maxRecord:10
        }
      ){
        list{
          id
          name
          type
          description
          category
          header
          content
          footer
          createdAt
        }
        pageInfo{
          totalRecords
          totalPage
          currentPage
        }
      }
    }`,
  };
  return GraphqlAPI(query, Authorization);
}

function setSnsAccountAsDefault({ id }) {
  const query = {
    query: `
    mutation{
      SetSnsAccountAsDefault(snsId:${id})
    }`,
  };
  return GraphqlAPI(query, Authorization);
}

function removeSNSAccount({ id, validate }) {
  const query = {
    query: `
    mutation{
      RemoveSNSAccount(snsId:${id}, validateOnly:${validate})
    }`,
  };
  return GraphqlAPI(query, Authorization);
}
