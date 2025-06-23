/*
 * LoginPage Messages
 *
 * This contains all the text for the LoginPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.LoginPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the LoginPage container!',
  },
  appName: {
    id: `appName`,
    defaultMessage: 'CAMPS',
  },
  email: {
    id: `email`,
    defaultMessage: 'Email address',
  },
  password: {
    id: `password`,
    defaultMessage: 'Password',
  },
  confirmPassword: {
    id: `confirmPassword`,
    defaultMessage: 'confirmPassword',
  },
  submit: {
    id: `submit`,
    defaultMessage: 'Submit',
  },
  registrationForConfirmationMsg: {
    id: 'registrationForConfirmationMsg',
  },
  okButton: {
    id: 'done',
  },
  register: {
    id: 'register',
  },
  terms: {
    id: 'terms',
  },
  hasAccount: {
    id: 'hasAccount',
  },
  loginhere: {
    id: 'loginhere',
  },
  username: {
    id: 'username',
  },
  securedFileTransfer: {
    id: 'securedFileTransfer',
  },
  basic: {
    id: 'basic',
  },
  creator: {
    id: 'creator',
  },
  userType: {
    id: 'userType',
  },
});
