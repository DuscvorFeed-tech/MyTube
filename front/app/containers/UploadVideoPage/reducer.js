/*
 *
 * RegistrationPage reducer
 *
 */
import produce from 'immer';
import { LOCATION_CHANGE } from 'connected-react-router';
import {
  LOAD_CATEGORY_SUCCESS,
  SET_ERRORS,
  SUBMIT_UPLOAD,
  SUBMIT_UPLOAD_SUCCESS,
  VIDEO_PROCESS,
  VIDEO_PROCESS_SUCCESS,
  SET_CATEGORY,
} from './constants';

export const initialState = { errors: undefined };

/* eslint-disable default-case, no-param-reassign */
const uploadVideoPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_ERRORS:
        draft.errors = action.errors;
        draft.loading = false;
        break;
      case LOCATION_CHANGE:
        draft.errors = undefined;
        break;
      case SUBMIT_UPLOAD:
        draft.loading = true;
        break;
      case SUBMIT_UPLOAD_SUCCESS:
        draft.loading = false;
        break;
      case VIDEO_PROCESS:
        draft.loading = true;
        break;
      case VIDEO_PROCESS_SUCCESS:
        draft.loading = false;
        draft.videoResponse = action.response;
        break;
      case LOAD_CATEGORY_SUCCESS:
        draft.categories = action.categories;
        break;
      case SET_CATEGORY:
        draft.categoryId = action.categoryId;
        break;
    }
  });

export default uploadVideoPageReducer;
