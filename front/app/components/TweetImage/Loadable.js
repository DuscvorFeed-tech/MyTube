/**
 *
 * Asynchronously loads the component for TweetImage
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
