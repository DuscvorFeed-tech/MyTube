import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the loginPage state domain
 */

const selectLoginPageDomain = state => state.loginPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by LoginPage
 */

const makeSelectLoginPage = () =>
  createSelector(
    selectLoginPageDomain,
    substate => substate,
  );

const makeSelectErrors = () =>
  createSelector(
    selectLoginPageDomain,
    state => state.errors,
  );

export default makeSelectLoginPage;
export { selectLoginPageDomain, makeSelectErrors };
