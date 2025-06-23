/*
 *
 * SearchVideoPage reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  LOADED_VIDEO,
  ERROR_VIDEO,
  LOAD_VIDEOS,
} from './constants';

export const initialState = {
  loading: true,
};

/* eslint-disable default-case, no-param-reassign */
const categoryVideoPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        draft.loading = action.payload;
        break;
      case LOAD_VIDEOS:
        draft.videoCategoryId = action.videoCategoryId;
        break;
      case LOADED_VIDEO:
        draft.listVideos = action.response;
        break;
      case ERROR_VIDEO:
        draft.error = action.error;
        break;
    }
  });

export default categoryVideoPageReducer;
