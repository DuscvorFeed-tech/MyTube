/*
 *
 * FormPage reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION, SET_ERRORS, SET_FORM, SET_DATA } from './constants';

export const initialState = { success: false };

/* eslint-disable default-case, no-param-reassign */
const formPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case SET_ERRORS:
        draft.error = action.error;
        break;
      case SET_DATA:
        draft.success = action.success;
        break;
      case SET_FORM:
        draft.form = action.data;
        break;
    }
  });

export default formPageReducer;
