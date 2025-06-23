/*
 *
 * ParticipantDetailPage reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION, SET_DATA, RESET_DATA, SET_ERRORS } from './constants';

export const initialState = {
  partDetails: false,
  templateList: false,
  campDetails: false,
  cancelledWinner: 0,
  selectedValue: 0,
  participantStatus: 0,
  isEdit: false,
  entryList: false,
};

/* eslint-disable default-case, no-param-reassign */
const participantDetailPageReducer = (state = initialState, action) =>
  // eslint-disable-next-line consistent-return
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case SET_DATA:
        draft[action.key] = action.value;
        break;
      case SET_ERRORS:
        draft.error = action.error;
        break;
      case RESET_DATA:
        return initialState;
    }
  });

export default participantDetailPageReducer;
