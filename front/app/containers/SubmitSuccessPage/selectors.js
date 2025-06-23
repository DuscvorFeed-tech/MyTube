import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the submitSuccessPage state domain
 */

const selectSubmitSuccessPageDomain = state =>
  state.submitSuccessPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by SubmitSuccessPage
 */

const makeSelectSubmitSuccessPage = () =>
  createSelector(
    selectSubmitSuccessPageDomain,
    substate => substate,
  );

export default makeSelectSubmitSuccessPage;
export { selectSubmitSuccessPageDomain };
