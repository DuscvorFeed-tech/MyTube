import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the campaignDetailPage state domain
 */

const selectCampaignDetailPageDomain = state =>
  state.campaignDetailPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CampaignDetailPage
 */

const makeSelectCampaignDetailPage = () =>
  createSelector(
    selectCampaignDetailPageDomain,
    substate => substate,
  );

export default makeSelectCampaignDetailPage;
export { selectCampaignDetailPageDomain };
