/*
 * Text Messages
 *
 * This contains all the text for the Text component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.Text';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the Text component!',
  },
});
