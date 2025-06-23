import { createSelector } from 'reselect';
// import { stat } from 'fs';
import { initialState } from './reducer';

/**
 * Direct selector to the tweetPage state domain
 */

const selectTweetPageDomain = state => state.tweetPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by TweetPage
 */

const makeSelectTweetPage = () =>
  createSelector(
    selectTweetPageDomain,
    substate => substate,
  );

const makeSelectErrors = () =>
  createSelector(
    selectTweetPageDomain,
    state => state.errors,
  );

const makeSelectTweetData = () =>
  createSelector(
    selectTweetPageDomain,
    substate => substate.tweetData,
  );

const makeSelectTweetList = () =>
  createSelector(
    selectTweetPageDomain,
    substate => substate.tweetList,
  );

export default makeSelectTweetPage;
export {
  selectTweetPageDomain,
  makeSelectErrors,
  makeSelectTweetData,
  makeSelectTweetList,
};
