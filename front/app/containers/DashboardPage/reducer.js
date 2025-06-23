/*
 *
 * DashboardPage reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION, SET_DATA, SET_ERRORS, RESET_DATA } from './constants';

export const initialState = {
  statistics: false,
  barStatistics: false,
  statTotals: false,
  campaignList: false,
  allcampaignList: false,
};

/* eslint-disable default-case, no-param-reassign */
const dashboardPageReducer = (state = initialState, action) =>
  // eslint-disable-next-line consistent-return
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case SET_DATA:
        draft[action.key] = action.value;
        break;
      case SET_ERRORS:
        draft.errors = action.errors;
        break;
      case RESET_DATA:
        return initialState;
    }
  });

export default dashboardPageReducer;
