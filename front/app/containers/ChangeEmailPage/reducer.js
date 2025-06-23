/*
 *
 * ChangeEmailPage reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION, SET_ERRORS } from './constants';

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const changeEmailPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;

      case SET_ERRORS:
        draft.errors = action.payload;
        break;
    }
  });

export default changeEmailPageReducer;
