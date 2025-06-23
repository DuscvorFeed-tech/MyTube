import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectConfirmForgotPasswordEmailPageDomain = state =>
  state.confirmEmailPage || initialState;

const makeSelectConfirmForgotPasswordEmailPage = () =>
  createSelector(
    selectConfirmForgotPasswordEmailPageDomain,
    substate => substate,
  );

const makeSelectLoading = () =>
  createSelector(
    selectConfirmForgotPasswordEmailPageDomain,
    state => state.loading,
  );

export default makeSelectConfirmForgotPasswordEmailPage;
export { selectConfirmForgotPasswordEmailPageDomain, makeSelectLoading };
