/*
 *
 * LinkSnsPage reducer
 *
 */
import produce from 'immer';
import { LOCATION_CHANGE } from 'connected-react-router';
import { DEFAULT_ACTION, SET_ERRORS } from './constants';

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const linkSnsPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_ERRORS:
        draft.errors = action.errors;
        break;
      case LOCATION_CHANGE:
        draft.errors = null;
        break;
      case DEFAULT_ACTION:
        break;
    }
  });

export default linkSnsPageReducer;
