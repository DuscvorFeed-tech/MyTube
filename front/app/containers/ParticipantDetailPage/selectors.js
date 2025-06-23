import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the participantDetailPage state domain
 */

const selectParticipantDetailPageDomain = state =>
  state.participantDetailPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ParticipantDetailPage
 */

const makeSelectParticipantDetailPage = () =>
  createSelector(
    selectParticipantDetailPageDomain,
    substate => substate,
  );

export default makeSelectParticipantDetailPage;
export { selectParticipantDetailPageDomain };
