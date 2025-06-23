import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the activateCompletePage state domain
 */

const selectActivateCompletePageDomain = state =>
  state.activateCompletePage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ActivateCompletePage
 */

const makeSelectActivateCompletePage = () =>
  createSelector(
    selectActivateCompletePageDomain,
    substate => substate,
  );

export default makeSelectActivateCompletePage;
export { selectActivateCompletePageDomain };
