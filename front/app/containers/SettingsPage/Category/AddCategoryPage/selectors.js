import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addCategoryPage state domain
 */

const selectAddCategoryPageDomain = state =>
  state.addCategoryPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddCategoryPage
 */

const makeSelectAddCategoryPage = () =>
  createSelector(
    selectAddCategoryPageDomain,
    substate => substate,
  );

export default makeSelectAddCategoryPage;
export { selectAddCategoryPageDomain };
