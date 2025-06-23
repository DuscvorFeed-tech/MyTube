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
  emailUsername: {
    id: `emailUsername`,
    defaultMessage: 'Email address or Username',
  },
  password: {
    id: `password`,
    defaultMessage: 'Password',
  },
  forgotPassword: {
    id: `forgotPassword`,
    defaultMessage: 'Forgot Password',
  },
  login: {
    id: `login`,
    defaultMessage: 'Login',
  },
  clickHere: {
    id: `clickHere`,
    defaultMessage: 'Click Here',
  },
  registerHere: {
    id: `registerHere`,
    defaultMessage: 'Register Here',
  },
  rememberMe: {
    id: `rememberMe`,
    defaultMessage: 'Remember Me',
  },
  noAccount: {
    id: `noAccount`,
    defaultMessage: 'No Account yet?',
  },
});
