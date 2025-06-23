/*
 *
 * AddFormPage reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  SET_FORM_DATA,
  SET_ERRORS,
  REMOVE_IMAGE_HEADER,
  SET_IMAGE_HEADER,
} from './constants';

export const initialState = {
  imageHeader: {},
};

/* eslint-disable default-case, no-param-reassign */
const addFormPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case SET_FORM_DATA:
        draft[action.key] = action.value;
        break;
      case SET_ERRORS:
        draft.errors = action.errors;
        break;
      case REMOVE_IMAGE_HEADER:
        document.getElementById('imageInput').value = null;
        draft.imageHeader = null;
        break;
      case SET_IMAGE_HEADER:
        draft.imageHeader = action.imageHeader;
        break;
    }
  });

export default addFormPageReducer;
