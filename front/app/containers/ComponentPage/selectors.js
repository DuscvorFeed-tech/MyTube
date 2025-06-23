import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the componentPage state domain
 */

const selectComponentPageDomain = state => state.componentPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ComponentPage
 */

const makeSelectComponentPage = () =>
  createSelector(
    selectComponentPageDomain,
    substate => substate,
  );

export default makeSelectComponentPage;
export { selectComponentPageDomain };
