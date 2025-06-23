import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the schedulePage state domain
 */

const selectSchedulePageDomain = state => state.schedulePage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by SchedulePage
 */

const makeSelectSchedulePage = () =>
  createSelector(
    selectSchedulePageDomain,
    substate => substate,
  );

export default makeSelectSchedulePage;
export { selectSchedulePageDomain };
