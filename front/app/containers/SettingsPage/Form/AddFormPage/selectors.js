import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addFormPage state domain
 */

const selectAddFormPageDomain = state => state.addFormPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddFormPage
 */

const makeSelectAddFormPage = () =>
  createSelector(
    selectAddFormPageDomain,
    substate => substate,
  );

const makeSelectImage = () =>
  createSelector(
    selectAddFormPageDomain,
    substate => substate.imageHeader,
  );

const makeSelectErrors = () =>
  createSelector(
    selectAddFormPageDomain,
    state => state.errors,
  );

const makeSelectFormDetails = () =>
  createSelector(
    selectAddFormPageDomain,
    substate => substate.formDetails,
  );

export default makeSelectAddFormPage;
export {
  selectAddFormPageDomain,
  makeSelectImage,
  makeSelectErrors,
  makeSelectFormDetails,
};
