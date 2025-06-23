import produce from 'immer';
import {
  DEFAULT_ACTION,
  SET_ACTIVE_TAB,
  RESET_DATA,
  SET_ERRORS,
  SET_DATA,
} from './constants';

export const initialState = {
  activeTab: 1,
  winnerList: false,
  labelList: false,
  campaignList: false,
  campDetails: false,
  tempDetails: false,
  winTempList: false,
  loseTempList: false,
  tyTempList: false,
  formCompTempList: false,
  formList: false,
  newCampPrize: false,
  loading: false,
};

/* eslint-disable default-case, no-param-reassign */
const createCampaignPageReducer = (state = initialState, action) =>
  // eslint-disable-next-line consistent-return
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case SET_ACTIVE_TAB:
        draft.activeTab = action.tab;
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

export default createCampaignPageReducer;
