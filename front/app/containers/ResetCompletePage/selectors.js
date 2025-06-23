import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the resetCompletePage state domain
 */

const selectResetCompletePageDomain = state =>
  state.resetCompletePage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ResetCompletePage
 */

const makeSelectResetCompletePage = () =>
  createSelector(
    selectResetCompletePageDomain,
    substate => substate,
  );

export default makeSelectResetCompletePage;
export { selectResetCompletePageDomain };
