import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the settingsPage state domain
 */

const selectSettingsPageDomain = state => state.settingsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by SettingsPage
 */

const makeSelectSettingsPage = () =>
  createSelector(
    selectSettingsPageDomain,
    substate => substate,
  );

const makeSelectLabels = () =>
  createSelector(
    selectSettingsPageDomain,
    state => state.labels,
  );

const makeSelectAccounts = () =>
  createSelector(
    selectSettingsPageDomain,
    state => state.accounts,
  );

const makeSelectForms = () =>
  createSelector(
    selectSettingsPageDomain,
    state => state.forms,
  );

const makeSelectTemplates = () =>
  createSelector(
    selectSettingsPageDomain,
    state => state.templates,
  );

export default makeSelectSettingsPage;
export {
  selectSettingsPageDomain,
  makeSelectLabels,
  makeSelectForms,
  makeSelectAccounts,
  makeSelectTemplates,
};
