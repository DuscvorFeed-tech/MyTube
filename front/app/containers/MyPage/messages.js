/*
 * MyPage Messages
 *
 * This contains all the text for the MyPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.MyPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the MyPage container!',
  },
  myvideos: {
    id: 'myvideos',
  },
});
