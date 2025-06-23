/*
 * ChangePasswordPage Messages
 *
 * This contains all the text for the ChangePasswordPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.ChangePasswordPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the ChangePasswordPage container!',
  },
  changePassword: {
    id: `changePassword`,
    defaultMessage: 'Change Password',
  },
  currentPassword: {
    id: `currentPassword`,
    defaultMessage: 'Current Password',
  },
  newPassword: {
    id: `newPassword`,
    defaultMessage: 'New Password',
  },
  confirmNewPassword: {
    id: `confirmNewPassword`,
    defaultMessage: 'Confirm New Password',
  },
  btn_cancel: {
    id: `cancel`,
    defaultMessage: 'Cancel',
  },
  btn_save: {
    id: `save`,
    defaultMessage: 'Save',
  },
});
