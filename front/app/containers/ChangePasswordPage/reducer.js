/*
 *
 * ChangePasswordPage reducer
 *
 */
import produce from 'immer';
import { LOCATION_CHANGE } from 'connected-react-router';
import { DEFAULT_ACTION, SET_ERRORS } from './constants';

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const changePasswordPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case SET_ERRORS:
        draft.errors = action.errors;
        break;
      case LOCATION_CHANGE:
        draft.errors = undefined;
        break;
    }
  });

export default changePasswordPageReducer;
