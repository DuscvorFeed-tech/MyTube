/**
 *
 * Asynchronously loads the component for MyPage
 *
 */
import loadable from '../../utils/loadable';

export default loadable(() => import('./index'));
