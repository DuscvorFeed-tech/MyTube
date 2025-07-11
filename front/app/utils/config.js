/* eslint-disable prettier/prettier */
const { API_URL, APP_NAME } = process.env;
export const config = {
  API_URL,
  GRAPH_URL: `/graphql`,
  APP_NAME,
  DOWNLOAD_CSV_URL: `${API_URL}/download/csv`,
  UPLOAD_EVENT_SCHEDULE_CSV: `/api/upload-event-schedule-csv`,
  CREATE_TEMPLATE_FORM: `${API_URL}/api/create-template-form`,
  UPDATE_TEMPLATE_FORM: `${API_URL}/api/update-template-form`,
  POST_TWEET_DATA: `${API_URL}/api/tweet-data`,
  POST_TWEET_PHOTO: `${API_URL}/api/tweet-photo`,
  POST_TWEET_GIF: `${API_URL}/api/tweet-gif`,
  POST_TWEET_VIDEO: `${API_URL}/api/tweet-video`,
  FORM_IMAGE: `${API_URL}/form-image`,
  CREATE_MESSAGE_TEMPLATE: `${API_URL}/api/create-message-template`,
  CREATE_MESSAGE_TEMPLATE_GIF: `${API_URL}/api/create-message-template-gif`,
  CREATE_MESSAGE_TEMPLATE_VIDEO: `${API_URL}/api/create-message-template-video`,
  UPDATE_MESSAGE_TEMPLATE: `${API_URL}/api/update-message-template`,
  UPDATE_MESSAGE_TEMPLATE_GIF: `${API_URL}/api/update-message-template-gif`,
  UPDATE_MESSAGE_TEMPLATE_VIDEO: `${API_URL}/api/update-message-template-video`,
  DM_ENTRY_USER: `${API_URL}/api/dm`,
  DM_PHOTO_ENTRY_USER: `${API_URL}/api/dm-photo`,
  DM_GIF_ENTRY_USER: `${API_URL}/api/dm-gif`,
  DM_VIDEO_ENTRY_USER: `${API_URL}/api/dm-video`,
  SNS_CAMPAIGN_IMAGE: `${API_URL}/images`,
  ADD_IG_CAMPAIGN_POST_LINK: `${API_URL}/`,
  TWITTER_URL: `https://twitter.com`,
  INSTAGRAM_URL: `https://instagram.com`,
  BACK_FILL: `${API_URL}/api/backfill-campaign`,
  UPLOAD_PARTICIPANT_ENTRY_CSV: `${API_URL}/api/upload-participant-entry-csv`,
  TIKTOK_URL: `https://www.tiktok.com`,
  DOWNLOAD_EVENTS: `${API_URL}/download/events`,
  
  VIDEO_URL: `https://dzjohua0mjfel.cloudfront.net`,
  SUPPORTED_VIDEO_FORMAT: `3gp,3gpp,avi,flv,m4v,mkv,mov,mp4,mpeg,mpeg4,ogg,ogv,webm,wmv`,
  SUPPORTED_IMG_FORMAT: `jpeg,jpg,png`,
  USER_LOGIN_ROUTE: `user/login`,
  USER_SIGNUP_ROUTE: `user/signup`,
  USER_PROFILE_ROUTE: `user/profile`,
  USER_FORGOT_PASSWORD_ROUTE: `password/forgot`,
  USER_FORGOT_PASSWORD_CONFIRMATION_ROUTE: `password/forgot/confirmation`,
  USER_RESET_PASSWORD_ROUTE: `password/reset`,
  GET_ALL_VIDEOS_ROUTE: `video/all`,
  PROCESS_VIDEO_ROUTE:`video/process`,
  UPLOAD_VIDEO_ROUTE: `video/upload`,
  WATCH_VIDEO_ROUTE: `watch/subscriber`,
  WATCH_VIDEO_DETAIL_ROUTE: `video/detail`,
  USER_UPLOADED_VIDEO_ROUTE: `user/uploaded/videos`,
  USER_SIGNUP_CONFIRMATION_ROUTE:`user/signup/confirmation`,
  VIDEO_VIEW_ROUTE:`video/view`,
  IP_URL: `https://api.ipify.org/`,
  VIDEO_VIEW:`${API_URL}/video/view`,
  VIDEO_DETAIL:`${API_URL}/video/detail`,
  CONFIRM_EMAIL:`${API_URL}/user/signup/confirmation`,
  PROCESS_VIDEO:`${API_URL}/video/process`,
  LOAD_THUMBNAIL:`${API_URL}/video/thumbnail/temp`,
  FORGOT_PASSWORD: `${API_URL}/password/forgot`,
  GET_HOT_VIDEOS_ROUTE: `video/hot`,
  GET_TRENDING_VIDEOS_ROUTE: `video/trending`,
  GET_CATEGORIES_ROUTE: `video/category`,
  GET_SNS_ACCOUNTS: `user/snsaccount`,
  SAVE_SNS_ACCOUNTS: `user/snsaccount`,
  GET_NEW_VIDEOS_ROUTE: `video/new`,
};
