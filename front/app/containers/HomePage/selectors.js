/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.home || initialState;

const makeSelectHotVideos = () =>
  createSelector(
    selectHome,
    homeState => homeState.listHot,
  );

const makeSelectTrendingVideos = () =>
  createSelector(
    selectHome,
    homeState => homeState.listTrending,
  );

const makeSelectError = () =>
  createSelector(
    selectHome,
    homeState => homeState.error,
  );

const makeSelectLoading = () =>
  createSelector(
    selectHome,
    homeState => homeState.loading,
  );

const makeSelectNewVideos = () =>
  createSelector(
    selectHome,
    homeState => homeState.listNew,
  );

const makeSelectFeaturedVideos = () =>
  createSelector(
    selectHome,
    homeState => homeState.listFeatured,
  );

const makeSelectGirlsDJVideos = () =>
  createSelector(
    selectHome,
    homeState => homeState.listGirlsDJ,
  );

const makeSelectEDMVideos = () =>
  createSelector(
    selectHome,
    homeState => homeState.listEDM,
  );

const makeSelectMenu = () =>
  createSelector(
    selectHome,
    state => state.menu,
  );

export {
  selectHome,
  makeSelectHotVideos,
  makeSelectError,
  makeSelectTrendingVideos,
  makeSelectLoading,
  makeSelectNewVideos,
  makeSelectFeaturedVideos,
  makeSelectGirlsDJVideos,
  makeSelectEDMVideos,
  makeSelectMenu
};
