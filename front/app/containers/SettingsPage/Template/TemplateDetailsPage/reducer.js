/*
 *
 * TemplateDetailsPage reducer
 *
 */
import produce from 'immer';
import { LOCATION_CHANGE } from 'connected-react-router';
import { SET_TEMPLATE_DETAIL, SET_DATA, RESET_DATA } from './constants';

export const initialState = {
  templateDetail: {},
  isEdit: false,
};

/* eslint-disable default-case, no-param-reassign */
const templateDetailsPageReducer = (state = initialState, action) =>
  // eslint-disable-next-line consistent-return
  produce(state, draft => {
    switch (action.type) {
      case SET_TEMPLATE_DETAIL:
        draft.templateDetail = action.payload;
        break;
      case LOCATION_CHANGE:
        draft.templateDetail = undefined;
        draft.errors = undefined;
        break;
      case SET_DATA:
        draft[action.key] = action.value;
        break;
      case RESET_DATA:
        return initialState;
    }
  });

export default templateDetailsPageReducer;
