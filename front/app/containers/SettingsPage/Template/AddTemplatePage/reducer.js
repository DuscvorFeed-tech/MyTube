/*
 *
 * AddTemplatePage reducer
 *
 */
import produce from 'immer';
import { LOCATION_CHANGE } from 'connected-react-router';
import { SET_COMMON_TYPES, SET_ERRORS } from './constants';

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const addTemplatePageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_COMMON_TYPES:
        draft.commonTypes = action.payload;
        break;
      case SET_ERRORS:
        draft.errors = action.errors;
        break;
      case LOCATION_CHANGE:
        draft.errors = undefined;
        break;
    }
  });

export default addTemplatePageReducer;
