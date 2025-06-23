/*
 *
 * CampaignPage reducer
 *
 */
import produce from 'immer';
import { LOCATION_CHANGE } from 'connected-react-router';
import {
  SET_LABELS,
  SET_WINNER_TEMPLATES,
  SET_LOSER_TEMPLATES,
  SET_THANKYOU_TEMPLATES,
  SET_FORMS,
  SET_ERRORS,
  SET_CAMPAIGN_ID,
  SET_FORM_COMPLETE_TEMPLATES,
  SET_CAMPAIGN_LIST,
  SET_LOADING,
} from './constants';

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const createCampaignPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_LABELS:
        draft.labels = action.payload;
        break;
      case SET_WINNER_TEMPLATES:
        draft.winnerTemplates = action.payload;
        break;
      case SET_LOSER_TEMPLATES:
        draft.loserTemplates = action.payload;
        break;
      case SET_THANKYOU_TEMPLATES:
        draft.thankyouTemplates = action.payload;
        break;
      case SET_FORM_COMPLETE_TEMPLATES:
        draft.formCompleteTemplates = action.payload;
        break;
      case SET_FORMS:
        draft.formTemplates = action.payload;
        break;
      case SET_ERRORS:
        draft.errors = action.errors;
        break;
      case SET_CAMPAIGN_ID:
        draft.campaignId = action.campaignId;
        break;
      case SET_CAMPAIGN_LIST:
        draft.campaignList = action.campaignList;
        break;
      case SET_LOADING:
        draft.loading = action.loading;
        break;
      case LOCATION_CHANGE:
        draft.errors = null;
        draft.campaignId = null;
        break;
    }
  });

export default createCampaignPageReducer;
