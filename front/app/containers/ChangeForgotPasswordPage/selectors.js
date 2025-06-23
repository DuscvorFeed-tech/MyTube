import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the ChangeForgotPasswordPage state domain
 */

const selectChangeForgotPasswordPageDomain = state =>
  state.changeForgotPasswordPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ChangeForgotPasswordPage
 */

const makeSelectChangeForgotPasswordPage = () =>
  createSelector(
    selectChangeForgotPasswordPageDomain,
    substate => substate,
  );

const makeSelectErrors = () =>
  createSelector(
    selectChangeForgotPasswordPageDomain,
    state => state.errors,
  );

export default makeSelectChangeForgotPasswordPage;
export { selectChangeForgotPasswordPageDomain, makeSelectErrors };
