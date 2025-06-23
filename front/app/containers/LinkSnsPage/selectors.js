import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the linkSnsPage state domain
 */

const selectLinkSnsPageDomain = state => state.linkSnsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by LinkSnsPage
 */

const makeSelectLinkSnsPage = () =>
  createSelector(
    selectLinkSnsPageDomain,
    substate => substate,
  );

const makeSelectErrors = () =>
  createSelector(
    selectLinkSnsPageDomain,
    state => state.errors,
  );

export default makeSelectLinkSnsPage;
export { selectLinkSnsPageDomain, makeSelectErrors };
