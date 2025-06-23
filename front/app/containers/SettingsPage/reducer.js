/*
 *
 * SettingsPage reducer
 *
 */
import produce from 'immer';
import {
  SET_LABELS,
  SET_ACCOUNTS,
  SET_FORM_LIST,
  SET_TEMPLATES,
  SET_ERROR,
  SET_LOADING,
  RESET_PAGE,
} from './constants';

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const settingsPageReducer = (state = initialState, action) =>
  // eslint-disable-next-line consistent-return
  produce(state, draft => {
    switch (action.type) {
      case SET_LABELS:
        draft.labels = action.payload;
        break;
      case SET_ACCOUNTS:
        draft.accounts = action.payload;
        break;
      case SET_FORM_LIST:
        draft.forms = action.payload;
        break;
      case SET_TEMPLATES:
        draft.templates = action.payload;
        break;
      case SET_ERROR:
        draft.error = action.error;
        break;
      case SET_LOADING:
        draft.loading = action.loading;
        break;
      case RESET_PAGE:
        return initialState;
    }
  });

export default settingsPageReducer;
