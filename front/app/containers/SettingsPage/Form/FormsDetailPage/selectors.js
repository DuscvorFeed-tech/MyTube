import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the formsDetailPage state domain
 */

const selectFormsDetailPageDomain = state =>
  state.formsDetailPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by FormsDetailPage
 */

const makeSelectFormsDetailPage = () =>
  createSelector(
    selectFormsDetailPageDomain,
    substate => substate,
  );
const makeSelectFormDetails = () =>
  createSelector(
    selectFormsDetailPageDomain,
    substate => substate.formDetails,
  );

const makeSelectImage = () =>
  createSelector(
    selectFormsDetailPageDomain,
    substate => substate.imageHeader,
  );

const makeSelectErrors = () =>
  createSelector(
    selectFormsDetailPageDomain,
    state => state.errors,
  );

export default makeSelectFormsDetailPage;
export {
  selectFormsDetailPageDomain,
  makeSelectFormDetails,
  makeSelectImage,
  makeSelectErrors,
};
