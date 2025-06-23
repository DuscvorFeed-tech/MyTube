/*
 *
 * AddLabelPage reducer
 *
 */
import produce from 'immer';
import { LOCATION_CHANGE } from 'connected-react-router';
import { SET_ERRORS } from './constants';

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const addLabelPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_ERRORS:
        draft.errors = action.errors;
        break;
      case LOCATION_CHANGE:
        draft.errors = undefined;
        break;
    }
  });

export default addLabelPageReducer;
