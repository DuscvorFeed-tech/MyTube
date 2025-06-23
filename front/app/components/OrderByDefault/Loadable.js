/**
 *
 * Asynchronously loads the component for OrderByDefault
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
