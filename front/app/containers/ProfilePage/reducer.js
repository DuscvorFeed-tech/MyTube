/*
 *
 * ProfilePage reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION, LOADED_SNS_ACCOUNTS } from './constants';

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const profilePageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        draft.loading = action.payload;
        break;
      case LOADED_SNS_ACCOUNTS:
        draft.snsAccounts = action.response;
        break;
    }
  });

export default profilePageReducer;
