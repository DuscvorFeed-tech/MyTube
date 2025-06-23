/*
 *
 * CampaignDetailPage reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION, SET_DATA, RESET_DATA, SET_ERRORS } from './constants';

export const initialState = {
  winnerList: false,
  labelList: false,
  campDetails: false,
  tab: 1,
  tempDetails: false,
  cancelledWinner: 0,
  ids: [],
  generateMessage: false,
  winnerListCount: 0,
  winnerInitialListCount: 0,
  remainingWinners: 0,
  totalExpectedWinners: 0,
  participantStatus: 0,
  selectedValue: 0,
  showFlow: 1,
  totalGeneratedWinners: 0,
  prizeDistribution: false,
  newCampPrize: false,
  listOfPrizes: false,
  templateList: false,
  campaignList: false,
  cancelSuccess: false,
  statistics: false,
  statTotals: false,
  loading: false,
  disabledFS: false,
  backfill: 'init',
  uncheckParticipantByPager: null,
};

/* eslint-disable default-case, no-param-reassign */
const campaignDetailPageReducer = (state = initialState, action) =>
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

export default campaignDetailPageReducer;
