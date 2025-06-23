import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectConfirmEmailSuccessPageDomain = state =>
  state.confirmEmailPage || initialState;

const makeSelectConfirmEmailSuccessPage = () =>
  createSelector(
    selectConfirmEmailSuccessPageDomain,
    substate => substate,
  );

export default makeSelectConfirmEmailSuccessPage;
export { selectConfirmEmailSuccessPageDomain };
