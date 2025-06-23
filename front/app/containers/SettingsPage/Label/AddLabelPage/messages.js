/*
 * AddLabelPage Messages
 *
 * This contains all the text for the AddLabelPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.AddLabelPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the AddLabelPage container!',
  },
  addLabel: {
    id: `addLabel`,
  },
  labelName: {
    id: `labelName`,
    defaultMessage: 'Label Name',
  },
  color: {
    id: `color`,
    defaultMessage: 'Color',
  },
  completionMessage: {
    id: `${scope}.completionMessage`,
  },
  btnAdd: {
    id: `add`,
  },
  btnCancel: {
    id: `cancel`,
  },
});
