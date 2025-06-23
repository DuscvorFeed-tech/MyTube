import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the notificationPage state domain
 */

const selectNotificationPageDomain = state =>
  state.notificationPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by NotificationPage
 */

const makeSelectNotificationPage = () =>
  createSelector(
    selectNotificationPageDomain,
    substate => substate,
  );

export default makeSelectNotificationPage;
export { selectNotificationPageDomain };
