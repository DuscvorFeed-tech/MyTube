/*
 * Search Messages
 *
 * This contains all the text for the Search component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.Search';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the Search component!',
  },
  btnSearch: {
    id: `btnSearch`,
  },
});
