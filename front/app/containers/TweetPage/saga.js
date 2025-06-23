/* eslint-disable no-undef */
/* eslint-disable camelcase */
import { takeLeading, takeLatest, call, put } from 'redux-saga/effects';
import { NativeAPI, GraphqlAPI, Authorization } from 'utils/request';
import { config } from 'utils/config';
import { modalToggler } from 'utils/commonHelper';
import { MediaType } from 'library/commonValues';
import { setErrors, setData, resetData, setTweetList } from './actions';
import { SUBMIT_TWEET, FETCH_TWEET_LIST, DELETE_TWEET } from './constants';
import { setError } from '../SettingsPage/actions';

export default function* tweetPageSaga() {
  yield takeLatest(FETCH_TWEET_LIST, fetchTweetList);
  yield takeLeading(SUBMIT_TWEET, submitTweet);
  yield takeLeading(DELETE_TWEET, deleteTweet);
}

function* submitTweet({ data }) {
  const url = config[`POST_TWEET_${data.media}`];
  let values = data;
  let isForm = false;
  if (data.media !== MediaType.Data) {
    values = new FormData();
    isForm = true;
    Object.keys(data).forEach(key => {
      if (key === 'image') {
        data[key].map(m => values.append(key, m));
      } else {
        values.append(key, data[key]);
      }
    });

    if (data.type === 1) {
      values.delete('post_schedule');
    }
  }
  if (data.type === 1) {
    delete values.post_schedule;
  }

  const result = yield call(NativeAPI, values, url, isForm);
  if (result.success) {
    yield put(resetData());
    yield put(setData('success', true));
    if (!data.isSaveOnly) {
      if (data.type === 1) {
        modalToggler('publishModalSuccess');
      } else {
        modalToggler('scheduleModalSuccess');
      }
    } else {
      modalToggler('saveModal');
    }
  } else {
    yield put(setData('isPreview', false));
    yield put(setData('success', false));
    yield put(setErrors(result.errors));
  }
}

function* fetchCommonTypes() {
  const data = yield call(commontypes);
  if (data.success && data.CommonTypes) {
    const { CommonTypes } = data;
    yield put(setData('common', CommonTypes[0].data));
  }
}

function* fetchTweetList({ data }) {
  yield call(fetchCommonTypes);
  const response = yield call(fetchTweets, data);
  if (response.success) {
    yield put(setTweetList(response.GetSNSPostList));
  } else {
    // yield put(setErrors(data.errors));
  }
}

function* deleteTweet({ data }) {
  const response = yield call(removeTweet, data.id);
  if (response.success) {
    modalToggler('DeleteTweetSuccess');
    yield fetchTweetList({ data });
  } else {
    yield put(setError(response.error));
  }
}

// #region GRAPHQL QUERIES
// eslint-disable-next-line no-unused-vars
function fetchTweets(data) {
  const query = {
    query: `
    query($createdAt: String, $snsId: Int!, $type: Int, $status: Int){
      GetSNSPostList(
        snsId: $snsId,
        snsPostFilter: {
          createdAt: $createdAt,
          type: $type,
          status: $status
        },
        pager:{
          page: 1
          maxRecord: 10
        }
      ){
        pageInfo{
          totalRecords
          totalPage
          currentPage
        }
        list{
          id
          content
          media_file {
            id
            url
          }
          media_type
          status
          createdAt
        }
      }
    }`,
    variables: {
      type: data.type === 2 ? data.type : null,
      snsId: data.snsId,
      createdAt: data.createdAt,
      status: data.status,
    },
  };

  return GraphqlAPI(query, Authorization);
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

function removeTweet(id) {
  const query = {
    query: `
    mutation{
      DeleteTweet(id:${id})
    }`,
  };
  return GraphqlAPI(query, Authorization);
}

// #endregion
