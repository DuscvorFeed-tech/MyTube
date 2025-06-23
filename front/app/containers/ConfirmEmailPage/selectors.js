import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the ConfirmEmailPage state domain
 */

const selectConfirmEmailPageDomain = state =>
  state.confirmEmailPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ConfirmEmailPage
 */

const makeSelectConfirmEmailPage = () =>
  createSelector(
    selectConfirmEmailPageDomain,
    substate => substate,
  );

const makeSelectSuccess = () =>
  createSelector(
    selectConfirmEmailPageDomain,
    substate => substate.success,
  );

const makeSelectLoading = () =>
  createSelector(
    selectConfirmEmailPageDomain,
    substate => substate.loading,
  );

export default makeSelectConfirmEmailPage;
export { selectConfirmEmailPageDomain, makeSelectSuccess, makeSelectLoading };
