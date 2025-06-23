/*
 *
 * FormsDetailPage reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  SET_FORM_DETAILS,
  SET_DATA,
  RESET_DATA,
  REMOVE_IMAGE_HEADER,
  SET_IMAGE_HEADER,
} from './constants';

export const initialState = {
  formDetails: {},
  isEdit: false,
};

/* eslint-disable default-case, no-param-reassign */
const formsDetailPageReducer = (state = initialState, action) =>
  // eslint-disable-next-line consistent-return
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case SET_FORM_DETAILS:
        draft.formDetails = action.formDetails;
        draft.errors = null;
        break;
      case SET_DATA:
        draft[action.key] = action.value;
        break;
      case RESET_DATA:
        return initialState;
      case REMOVE_IMAGE_HEADER:
        document.getElementById('imageInput').value = '';
        draft.formDetails.imageHeader = null;
        break;
      case SET_IMAGE_HEADER:
        draft.formDetails.imageHeader = action.imageHeader;
        break;
    }
  });

export default formsDetailPageReducer;
