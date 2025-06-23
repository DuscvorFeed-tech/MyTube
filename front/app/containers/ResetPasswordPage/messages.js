/*
 * ResetPasswordPage Messages
 *
 * This contains all the text for the ResetPasswordPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.ResetPasswordPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the ResetPasswordPage container!',
  },
  resetPassword: {
    id: `resetPassword`,
  },
  newPassword: {
    id: `newPassword`,
    defaultMessage: 'New Password',
  },
  confirmPassword: {
    id: `confirmPassword`,
    defaultMessage: 'Confirm Password',
  },
  cancel: {
    id: `cancel`,
  },
  save: {
    id: `save`,
  },
});
