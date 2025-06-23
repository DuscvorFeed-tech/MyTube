/**
 *
 * Asynchronously loads the component for ComponentPage
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
