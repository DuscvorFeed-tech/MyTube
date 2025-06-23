/*
 * Tweet Messages
 *
 * This contains all the text for the Tweet component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.Tweet';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the Tweet component!',
  },
  M0000045: {
    id: 'M0000045',
  },
  totalEntries: {
    id: 'totalEntries',
  },
  participants: {
    id: 'participants',
  },
  delete: {
    id: 'delete',
    defaultMessage: 'Delete',
  },
});
