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
  LOADED_VIDEO,
  ERROR_VIDEO,
  LOAD_VIDEOS,
  NEW_VIDEOS,
  FEATURED_VIDEOS,
  GIRLSDJ_VIDEOS,
  EDM_VIDEOS,
} from './constants';

// The initial state of the App
export const initialState = {
  listTrending: [
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
};

/* eslint-disable default-case, no-param-reassign */
const homeReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_VIDEOS:
        draft.loading = true;
        break;
      case LOADED_VIDEO:
        draft.listHot = action.response;
        draft.loading = false;
        break;
      case ERROR_VIDEO:
        draft.error = action.error;
        draft.loading = false;
        break;
      case NEW_VIDEOS:
        draft.listNew = action.response;
        draft.loading = false;
        break;
      case FEATURED_VIDEOS:
        draft.listFeatured = action.response;
        draft.loading = false;
        break;
      case GIRLSDJ_VIDEOS:
        draft.listGirlsDJ = action.response;
        draft.loading = false;
        break;
      case EDM_VIDEOS:
        draft.listEDM = action.response;
        draft.loading = false;
        break;
    }
  });

export default homeReducer;
