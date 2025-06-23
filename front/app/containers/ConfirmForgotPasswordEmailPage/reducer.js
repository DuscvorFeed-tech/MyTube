import produce from 'immer';
import { DEFAULT_ACTION, CONFIRM_KEY_CONFIRMATION_CODE } from './constants';

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const confirmForgotPasswordEmailPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case CONFIRM_KEY_CONFIRMATION_CODE:
        draft.loading = true;
        break;
    }
  });

export default confirmForgotPasswordEmailPageReducer;
