/**
 *
 * Asynchronously loads the component for TweetPage
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
