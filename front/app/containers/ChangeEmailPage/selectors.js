import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the changeEmailPage state domain
 */

const selectChangeEmailPageDomain = state =>
  state.changeEmailPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ChangeEmailPage
 */

const makeSelectChangeEmailPage = () =>
  createSelector(
    selectChangeEmailPageDomain,
    substate => substate,
  );

const makeSelectErrors = () =>
  createSelector(
    selectChangeEmailPageDomain,
    state => state.errors,
  );

export default makeSelectChangeEmailPage;
export { selectChangeEmailPageDomain, makeSelectErrors };
