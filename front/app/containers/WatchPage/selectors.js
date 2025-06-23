/**
 * Watchpage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectWatch = state => state.watch || initialState;

const makeSelectUsername = () =>
  createSelector(
    selectWatch,
    state => state.username,
  );

const makeSelectRelatedVideos = () =>
  createSelector(
    selectWatch,
    state => state.relatedVideos,
  );

const makeSelectNextVideo = () =>
  createSelector(
    selectWatch,
    state => state.nextVideo,
  );

const makeSelectVideoDetail = () =>
  createSelector(
    selectWatch,
    state => state.videoDetail,
  );

const makeSelectError = () =>
  createSelector(
    selectWatch,
    state => state.error,
  );

export {
  selectWatch,
  makeSelectUsername,
  makeSelectRelatedVideos,
  makeSelectNextVideo,
  makeSelectVideoDetail,
  makeSelectError,
};
