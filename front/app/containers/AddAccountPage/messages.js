/*
 * AddAccountPage Messages
 *
 * This contains all the text for the AddAccountPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.AddAccountPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the AddAccountPage container!',
  },
  addAccount: {
    id: `addAccount`,
  },
  addTwitterProfile: {
    id: `addTwitterProfile`,
  },
  addInstagramProfile: {
    id: `addInstagramProfile`,
  },
  addSocMedProfile: {
    id: `addSocMedProfile`,
  },
  connectProfiles: {
    id: `connectProfiles`,
  },
});
