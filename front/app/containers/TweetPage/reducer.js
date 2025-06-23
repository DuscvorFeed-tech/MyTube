/*
 *
 * TweetPage reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  SET_ERRORS,
  SET_DATA,
  RESET_DATA,
  SET_TWEET_LIST,
} from './constants';

export const initialState = {
  tab: 1,
  isPreview: false,
  success: false,
  errors: undefined,
  common: [],
};

/* eslint-disable default-case, no-param-reassign */
const tweetPageReducer = (state = initialState, action) =>
  // eslint-disable-next-line consistent-return
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case SET_ERRORS:
        draft.errors = action.error;
        break;
      case SET_DATA:
        draft[action.key] = action.value;
        break;
      case SET_TWEET_LIST:
        draft.tweetList = action.payload;
        break;
      case RESET_DATA:
        return initialState;
    }
  });

export default tweetPageReducer;
