/*
 * ForgotPasswordPage Messages
 *
 * This contains all the text for the ForgotPasswordPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.ForgotPasswordPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the ForgotPasswordPage container!',
  },
  email: {
    id: `email`,
    defaultMessage: 'Email address',
  },
  completionMessage: {
    id: `${scope}.completionMessage`,
  },
  forgotPassword: {
    id: `forgotPassword`,
    defaultMessage: 'Forgot Password',
  },
  btn_cancel: {
    id: `cancel`,
    defaultMessage: 'Cancel',
  },
  btn_submit: {
    id: `submit`,
    defaultMessage: 'Submit',
  },
  btn_ok: {
    id: `done`,
    defaultMessage: 'Ok',
  },
});
