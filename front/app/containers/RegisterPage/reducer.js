/*
 *
 * RegistrationPage reducer
 *
 */
import produce from 'immer';
import { LOCATION_CHANGE } from 'connected-react-router';
import { SET_ERRORS, SET_USERTYPE } from './constants';

export const initialState = { errors: undefined };

/* eslint-disable default-case, no-param-reassign */
const registerPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_ERRORS:
        draft.errors = action.errors;
        break;
      case LOCATION_CHANGE:
        draft.errors = undefined;
        break;
      case SET_USERTYPE:
        draft.userTypeId = action.userTypeId;
        break;
    }
  });

export default registerPageReducer;
