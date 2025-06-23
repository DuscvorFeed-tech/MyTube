import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addTemplatePage state domain
 */

const selectAddTemplatePageDomain = state =>
  state.addTemplatePage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddTemplatePage
 */

const makeSelectAddTemplatePage = () =>
  createSelector(
    selectAddTemplatePageDomain,
    substate => substate,
  );

const makeSelectCommonTypes = () =>
  createSelector(
    selectAddTemplatePageDomain,
    state => state.commonTypes,
  );

const makeSelectErrors = () =>
  createSelector(
    selectAddTemplatePageDomain,
    state => state.errors,
  );

export default makeSelectAddTemplatePage;
export { selectAddTemplatePageDomain, makeSelectCommonTypes, makeSelectErrors };
