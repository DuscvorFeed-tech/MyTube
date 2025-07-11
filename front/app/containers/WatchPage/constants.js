/*
 * HomeConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const CHANGE_USERNAME = 'app/WatchPage/CHANGE_USERNAME';
export const LOAD_VIDEO_DETAIL = 'app/WatchPage/LOAD_VIDEO_DETAIL';
export const LOAD_VIDEO_DETAIL_SUCCESS =
  'app/WatchPage/LOAD_VIDEO_DETAIL_SUCCESS';
export const LOAD_VIDEO_DETAIL_ERROR = 'app/WatchPage/LOAD_VIDEO_DETAIL_ERROR';
