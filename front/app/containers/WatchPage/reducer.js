/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import {
  CHANGE_USERNAME,
  LOAD_VIDEO_DETAIL_SUCCESS,
  LOAD_VIDEO_DETAIL_ERROR,
} from './constants';

// The initial state of the App
export const initialState = {
  username: '',
  relatedVideos: [
    {
      title: 'title1',
      hash: 'QmdSY7ydet2HudHGSu88X3RxQ7jU77zGRQMdgmeeueNfqD',
      email: 'sample@blotocol.com',
      static: true,
    },
    {
      title: 'title2',
      hash: 'QmdSY7ydet2HudHGSu88X3RxQ7jU77zGRQMdgmeeueNfqD',
      email: 'sample2@blotocol.com',
      static: true,
    },
    {
      title: 'title3',
      hash: 'QmdSY7ydet2HudHGSu88X3RxQ7jU77zGRQMdgmeeueNfqD',
      email: 'sample3@blotocol.com',
      static: true,
    },
  ],
  nextVideo: {
    title: 'title1',
    hash: 'QmdSY7ydet2HudHGSu88X3RxQ7jU77zGRQMdgmeeueNfqD',
    email: 'sample@blotocol.com',
    static: true,
  },
};

/* eslint-disable default-case, no-param-reassign */
const watchPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CHANGE_USERNAME:
        // Delete prefixed '@' from the github username
        draft.username = action.username.replace(/@/gi, '');
        break;
      case LOAD_VIDEO_DETAIL_SUCCESS:
        draft.videoDetail = action.response;
        break;
      case LOAD_VIDEO_DETAIL_ERROR:
        draft.error = action.error;
        break;
    }
  });

export default watchPageReducer;
