import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the CategoryVideoPage state domain
 */

const selectCategoryVideoPageDomain = state =>
  state.categoryVideoPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CategoryVideoPage
 */

const makeSelectCategoryVideoPage = () =>
  createSelector(
    selectCategoryVideoPageDomain,
    substate => substate,
  );

const makeSelectListVideos = () =>
  createSelector(
    selectCategoryVideoPageDomain,
    state => state.listVideos,
  );

const makeSelectCategoryId = () =>
  createSelector(
    selectCategoryVideoPageDomain,
    state => state.videoCategoryId,
  );

export default makeSelectCategoryVideoPage;
export {
  selectCategoryVideoPageDomain,
  makeSelectListVideos,
  makeSelectCategoryId,
};
