import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the formPreviewPage state domain
 */

const selectFormPreviewPageDomain = state =>
  state.formPreviewPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by FormPreviewPage
 */

const makeSelectFormPreviewPage = () =>
  createSelector(
    selectFormPreviewPageDomain,
    substate => substate,
  );

export default makeSelectFormPreviewPage;
export { selectFormPreviewPageDomain };
