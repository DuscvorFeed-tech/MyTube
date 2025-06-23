import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the ConfirmForgotPasswordEmailFailPage state domain
 */

const selectConfirmForgotPasswordEmailFailPageDomain = state =>
  state.confirmEmailPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ConfirmForgotPasswordEmailFailPage
 */

const makeSelectConfirmForgotPasswordEmailFailPage = () =>
  createSelector(
    selectConfirmForgotPasswordEmailFailPageDomain,
    substate => substate,
  );

const makeSelectSuccess = () =>
  createSelector(
    selectConfirmForgotPasswordEmailFailPageDomain,
    substate => substate.success,
  );

const makeSelectLoading = () =>
  createSelector(
    selectConfirmForgotPasswordEmailFailPageDomain,
    substate => substate.loading,
  );

export default makeSelectConfirmForgotPasswordEmailFailPage;
export {
  selectConfirmForgotPasswordEmailFailPageDomain,
  makeSelectSuccess,
  makeSelectLoading,
};
