/* eslint-disable no-console */

// import { showUpdateServiceWorker } from './containers/App/actions';
const handler = runtime => {
  const onUpdating = () => {
    console.log('SW Event:', 'onUpdating');
  };
  const onUpdateReady = () => {
    console.log('SW Event:', 'onUpdateReady');
    // Tells to new SW to take control immediately
    runtime.applyUpdate();
  };
  const onUpdated = () => {
    console.log('SW Event:', 'onUpdated');
    // Reload the webpage to load into the new version
    window.location.reload();
    // store.dispatch(showUpdateServiceWorker(true));
  };

  const onUpdateFailed = () => {
    console.log('SW Event:', 'onUpdateFailed');
    window.location.reload();
  };

  return { onUpdating, onUpdateReady, onUpdated, onUpdateFailed };
};

export default handler;
