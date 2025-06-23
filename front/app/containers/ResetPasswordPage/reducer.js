/*
 *
 * ResetPasswordPage reducer
 *
 */
import produce from 'immer';
import { SET_LOADING, SET_ERRORS } from './constants';

export const initialState = {
  loading: true,
};

/* eslint-disable default-case, no-param-reassign */
const resetPasswordPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_LOADING:
        draft.loading = action.payload;
        break;

      case SET_ERRORS:
        draft.errors = action.payload;
        break;
    }
  });

export default resetPasswordPageReducer;
