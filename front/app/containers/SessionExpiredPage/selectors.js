import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the sessionExpiredPage state domain
 */

const selectSessionExpiredPageDomain = state =>
  state.sessionExpiredPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by SessionExpiredPage
 */

const makeSelectSessionExpiredPage = () =>
  createSelector(
    selectSessionExpiredPageDomain,
    substate => substate,
  );

export default makeSelectSessionExpiredPage;
export { selectSessionExpiredPageDomain };
