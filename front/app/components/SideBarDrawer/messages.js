/*
 * Sidebar Messages
 *
 * This contains all the text for the Sidebar component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.Sidebar';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the Sidebar component!',
  },
  dashboard: {
    id: 'dashboard',
  },
  kafra: {
    id: 'kafra',
  },
  orders: {
    id: 'orders',
  },
  pairs: {
    id: 'pairs',
  },
  reports: {
    id: 'reports',
  },
  settings: {
    id: 'settings',
  },
  sigma: {
    id: 'sigma',
  },
  tokens: {
    id: 'tokens',
  },
  depositRequest: {
    id: 'depositRequest',
  },
  withdrawalRequest: {
    id: 'withdrawalRequest',
  },
  transaction: {
    id: 'transaction',
  },
  currencies: {
    id: 'currencies',
  },
  trade: {
    id: 'trade',
  },
  channel: {
    id: 'channel',
  },
  trending: {
    id: 'trending',
  },
  watchLater: {
    id: 'watchLater',
  },
});
