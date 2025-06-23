/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

const APP_NAME = '@@GLOBAL';
export const GET_REQUEST = 'GET';
export const POST_REQUEST = 'POST';
export const PUT_REQUEST = 'PUT';
export const LOAD_REPOS = 'boilerplate/App/LOAD_REPOS';
export const LOAD_REPOS_SUCCESS = 'boilerplate/App/LOAD_REPOS_SUCCESS';
export const LOAD_REPOS_ERROR = 'boilerplate/App/LOAD_REPOS_ERROR';
export const SET_USER_ACCOUNT = `${APP_NAME}/SET_USER_ACCOUNT`;
export const SHOW_UPDATE_SERVICE_WORKER = `${SHOW_UPDATE_SERVICE_WORKER}/SET_USER_ACCOUNT`;
