import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the formPage state domain
 */

const selectFormPageDomain = state => state.formPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by FormPage
 */

const makeSelectFormPage = () =>
  createSelector(
    selectFormPageDomain,
    substate => substate,
  );

export default makeSelectFormPage;
export { selectFormPageDomain };
