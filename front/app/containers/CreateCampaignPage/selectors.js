import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the campaignPage state domain
 */

const selectCreateCampaignPageDomain = state =>
  state.createCampaignPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CampaignPage
 */

const makeSelectCreateCampaignPage = () =>
  createSelector(
    selectCreateCampaignPageDomain,
    substate => substate,
  );

const makeSelectLabels = () =>
  createSelector(
    selectCreateCampaignPageDomain,
    state => state.labels,
  );

const makeSelectWinnerTemplates = () =>
  createSelector(
    selectCreateCampaignPageDomain,
    state => state.winnerTemplates,
  );

const makeSelectLoserTemplates = () =>
  createSelector(
    selectCreateCampaignPageDomain,
    state => state.loserTemplates,
  );

const makeSelectThankyouTemplates = () =>
  createSelector(
    selectCreateCampaignPageDomain,
    state => state.thankyouTemplates,
  );

const makeSelectFormCompleteTemplates = () =>
  createSelector(
    selectCreateCampaignPageDomain,
    state => state.formCompleteTemplates,
  );

const makeSelectFormTemplates = () =>
  createSelector(
    selectCreateCampaignPageDomain,
    state => state.formTemplates,
  );

const makeSelectErrors = () =>
  createSelector(
    selectCreateCampaignPageDomain,
    state => state.errors,
  );

const makeSelectCampaignId = () =>
  createSelector(
    selectCreateCampaignPageDomain,
    state => state.campaignId,
  );

const makeSelectCampList = () =>
  createSelector(
    selectCreateCampaignPageDomain,
    state => state.campaignList,
  );
export default makeSelectCreateCampaignPage;
export {
  selectCreateCampaignPageDomain,
  makeSelectLabels,
  makeSelectWinnerTemplates,
  makeSelectLoserTemplates,
  makeSelectThankyouTemplates,
  makeSelectFormCompleteTemplates,
  makeSelectFormTemplates,
  makeSelectErrors,
  makeSelectCampaignId,
  makeSelectCampList,
};
