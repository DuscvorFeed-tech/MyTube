import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the templateDetailsPage state domain
 */

const selectTemplateDetailsPageDomain = state =>
  state.templateDetailsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by TemplateDetailsPage
 */

const makeSelectTemplateDetailsPage = () =>
  createSelector(
    selectTemplateDetailsPageDomain,
    substate => substate,
  );

const makeSelectTemplateDetail = () =>
  createSelector(
    selectTemplateDetailsPageDomain,
    state => state.templateDetail,
  );

const makeSelectErrors = () =>
  createSelector(
    selectTemplateDetailsPageDomain,
    state => state.errors,
  );

export default makeSelectTemplateDetailsPage;
export {
  selectTemplateDetailsPageDomain,
  makeSelectTemplateDetail,
  makeSelectErrors,
};
