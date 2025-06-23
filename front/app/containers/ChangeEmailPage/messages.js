/*
 * ChangeEmailPage Messages
 *
 * This contains all the text for the ChangeEmailPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.ChangeEmailPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the ChangeEmailPage container!',
  },
  changeEmail: {
    id: `changeEmail`,
    defaultMessage: 'Change Email',
  },
  currentPassword: {
    id: `currentPassword`,
    defaultMessage: 'Current Password',
  },
  newEmail: {
    id: `newEmail`,
    defaultMessage: 'New Email address',
  },
  confirmEmail: {
    id: `confirmEmail`,
    defaultMessage: 'Confirm Email address',
  },
  password: {
    id: `password`,
    defaultMessage: 'Password',
  },
  btn_cancel: {
    id: `cancel`,
    defaultMessage: 'Cancel',
  },
  btn_save: {
    id: `save`,
    defaultMessage: 'Save',
  },
  btn_ok: {
    id: `ok`,
    defaultMessage: 'Ok',
  },
});
