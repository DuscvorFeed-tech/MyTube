import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the forgotPasswordPage state domain
 */

const selectForgotPasswordPageDomain = state =>
  state.forgotPasswordPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ForgotPasswordPage
 */

const makeSelectForgotPasswordPage = () =>
  createSelector(
    selectForgotPasswordPageDomain,
    substate => substate,
  );

const makeSelectError = () =>
  createSelector(
    selectForgotPasswordPageDomain,
    substate => substate.errors,
  );

export default makeSelectForgotPasswordPage;
export { selectForgotPasswordPageDomain, makeSelectError };
