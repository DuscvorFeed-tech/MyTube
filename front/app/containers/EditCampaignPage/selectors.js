import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the createCampaignPage state domain
 */

const selectEditCampaignPageDomain = state =>
  state.editCampaignPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CreateCampaignPage
 */

const makeSelectEditCampaignPage = () =>
  createSelector(
    selectEditCampaignPageDomain,
    substate => substate,
  );

export default makeSelectEditCampaignPage;
export { selectEditCampaignPageDomain };
