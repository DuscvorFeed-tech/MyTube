/*
 * LanguageSelector Messages
 *
 * This contains all the text for the LanguageSelector component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.LanguageSelector';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the LanguageSelector component!',
  },
  En: {
    id: `En`,
  },
  Ja: {
    id: `Ja`,
  },
});
