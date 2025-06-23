import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addAccountPage state domain
 */

const selectAddAccountPageDomain = state =>
  state.addAccountPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddAccountPage
 */

const makeSelectAddAccountPage = () =>
  createSelector(
    selectAddAccountPageDomain,
    substate => substate,
  );

export default makeSelectAddAccountPage;
export { selectAddAccountPageDomain };
