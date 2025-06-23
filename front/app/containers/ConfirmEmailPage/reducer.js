/*
 *
 * ConfirmEmailPage reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION, CONFIRM_SUCCESS } from './constants';

export const initialState = {
  loading: true,
};

/* eslint-disable default-case, no-param-reassign */
const confirmEmailPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case CONFIRM_SUCCESS:
        draft.success = action.success;
        draft.loading = false;
        break;
    }
  });

export default confirmEmailPageReducer;
