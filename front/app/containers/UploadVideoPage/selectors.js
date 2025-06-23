import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the loginPage state domain
 */

const selectUploadVideoPageDomain = state =>
  state.uploadVideoPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by LoginPage
 */

const makeSelectUploadVideoPage = () =>
  createSelector(
    selectUploadVideoPageDomain,
    substate => substate,
  );

const makeSelectErrors = () =>
  createSelector(
    selectUploadVideoPageDomain,
    state => state.errors,
  );

const makeSelectLoading = () =>
  createSelector(
    selectUploadVideoPageDomain,
    state => state.loading,
  );

const makeSelectVideoResponse = () =>
  createSelector(
    selectUploadVideoPageDomain,
    state => state.videoResponse,
  );

const makeSelectCategories = () =>
  createSelector(
    selectUploadVideoPageDomain,
    state => state.categories,
  );

const makeSelectCategoryID = () =>
  createSelector(
    selectUploadVideoPageDomain,
    state => state.categoryId,
  );

export default makeSelectUploadVideoPage;
export {
  selectUploadVideoPageDomain,
  makeSelectErrors,
  makeSelectLoading,
  makeSelectVideoResponse,
  makeSelectCategories,
  makeSelectCategoryID,
};
