/*
 * LanguageSelector Messages
 *
 * This contains all the text for the LanguageSelector component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.Header';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the Header component!',
  },
  search: {
    id: `search`,
  },
  login: {
    id: `login`,
  },
  logout: {
    id: `logout`,
  },
});
