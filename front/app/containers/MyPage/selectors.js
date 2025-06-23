import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the MyPage state domain
 */

const selectMyPageDomain = state => state.MyPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by MyPage
 */

const makeSelectMyPage = () =>
  createSelector(
    selectMyPageDomain,
    substate => substate,
  );

const makeSelectListVideos = () =>
  createSelector(
    selectMyPageDomain,
    state => state.listVideos,
  );

export default makeSelectMyPage;
export { selectMyPageDomain, makeSelectListVideos };
