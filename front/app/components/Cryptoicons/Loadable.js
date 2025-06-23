/**
 *
 * Asynchronously loads the component for Cryptoicons
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
