import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addLabelPage state domain
 */

const selectAddLabelPageDomain = state => state.addLabelPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddLabelPage
 */

const makeSelectAddLabelPage = () =>
  createSelector(
    selectAddLabelPageDomain,
    substate => substate,
  );

const makeSelectErrors = () =>
  createSelector(
    selectAddLabelPageDomain,
    state => state.errors,
  );

export default makeSelectAddLabelPage;
export { selectAddLabelPageDomain, makeSelectErrors };
