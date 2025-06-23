/*
 *
 * SchedulePage reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION, SET_DATA, RESET_DATA } from './constants';

export const initialState = { labelList: false, campaignList: false };

/* eslint-disable default-case, no-param-reassign */
const schedulePageReducer = (state = initialState, action) =>
  // eslint-disable-next-line consistent-return
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case SET_DATA:
        draft[action.key] = action.value;
        break;
      case RESET_DATA:
        return initialState;
    }
  });

export default schedulePageReducer;
