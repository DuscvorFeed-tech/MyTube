/**
 *
 * Asynchronously loads the component for Container
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
