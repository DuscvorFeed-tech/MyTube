/*
 *
 * TweetPage actions
 *
 */

import {
  DEFAULT_ACTION,
  SET_ERRORS,
  SET_DATA,
  RESET_DATA,
  FETCH_TWEET_LIST,
  SET_TWEET_LIST,
  SUBMIT_TWEET,
  DELETE_TWEET,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function submitTweet(data, userAccount) {
  return {
    type: SUBMIT_TWEET,
    data,
    userAccount,
  };
}

export function setErrors(error) {
  return {
    type: SET_ERRORS,
    error,
  };
}

export function resetData() {
  return {
    type: RESET_DATA,
  };
}

export function fetchTweetList(data) {
  return {
    type: FETCH_TWEET_LIST,
    data,
  };
}

export function setTweetList(payload) {
  return {
    type: SET_TWEET_LIST,
    payload,
  };
}

export function setData(key, value) {
  return {
    type: SET_DATA,
    key,
    value,
  };
}

export function deleteTweet(data) {
  return {
    type: DELETE_TWEET,
    data,
  };
}
