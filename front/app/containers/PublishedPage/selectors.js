import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the publishedPage state domain
 */

const selectPublishedPageDomain = state => state.publishedPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by PublishedPage
 */

const makeSelectPublishedPage = () =>
  createSelector(
    selectPublishedPageDomain,
    substate => substate,
  );
const makeSelectCampaignList = () =>
  createSelector(
    selectPublishedPageDomain,
    substate => substate.campaigns,
  );

export default makeSelectPublishedPage;
export { selectPublishedPageDomain, makeSelectCampaignList };
