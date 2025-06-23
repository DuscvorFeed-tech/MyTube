import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the changePasswordPage state domain
 */

const selectChangePasswordPageDomain = state =>
  state.changePasswordPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ChangePasswordPage
 */

const makeSelectChangePasswordPage = () =>
  createSelector(
    selectChangePasswordPageDomain,
    substate => substate,
  );

const makeSelectErrors = () =>
  createSelector(
    selectChangePasswordPageDomain,
    state => state.errors,
  );

export default makeSelectChangePasswordPage;
export { selectChangePasswordPageDomain, makeSelectErrors };
