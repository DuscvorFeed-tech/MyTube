/* eslint-disable consistent-return */
/*
 *
 * PublishedPage reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  SET_CAMPAIGN_LIST,
  SET_DATA,
  RESET_DATA,
} from './constants';

export const initialState = { labelList: false };

/* eslint-disable default-case, no-param-reassign */
const publishedPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case SET_CAMPAIGN_LIST:
        draft.campaigns = action.payload;
        break;
      case SET_DATA:
        draft[action.key] = action.value;
        break;
      case RESET_DATA:
        return initialState;
    }
  });

export default publishedPageReducer;
