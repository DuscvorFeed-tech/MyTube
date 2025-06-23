import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the searchVideoPage state domain
 */

const selectSearchVideoPageDomain = state =>
  state.searchVideoPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by SearchVideoPage
 */

const makeSelectSearchVideoPage = () =>
  createSelector(
    selectSearchVideoPageDomain,
    substate => substate,
  );

const makeSelectListVideos = () =>
  createSelector(
    selectSearchVideoPageDomain,
    state => state.listVideos,
  );

const makeSelectKeyword = () =>
  createSelector(
    selectSearchVideoPageDomain,
    state => state.keyword,
  );

export default makeSelectSearchVideoPage;
export { selectSearchVideoPageDomain, makeSelectListVideos, makeSelectKeyword };
