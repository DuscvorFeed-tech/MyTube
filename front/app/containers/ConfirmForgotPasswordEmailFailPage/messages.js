/*
 * ConfirmForgotPasswordEmailFailPage Messages
 *
 * This contains all the text for the ConfirmEmailPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.ConfirmEmailPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the ConfirmEmailPage container!',
  },
  headerTitle: {
    id: `emailConfirm`,
  },
  login: {
    id: `login`,
  },
  confirmError: {
    id: `emailConfirmError`,
  },
});
