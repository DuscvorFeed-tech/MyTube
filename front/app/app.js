/* eslint-disable camelcase */
/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import '@babel/polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
// import * as Sentry from '@sentry/browser';
import history from 'utils/history';
// import 'sanitize.css/sanitize.css';

import './assets/css/style.css';
import './assets/css/base/fonts.css';
import './assets/css/new-style.css';
// import './assets/css/base/global.css';
// import 'assets/css/icofont.min.css';

import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/scss/bootstrap.scss';
import 'bootstrap/scss/bootstrap-grid.scss';
import 'bootstrap/dist/js/bootstrap.min';

/* import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';

import 'react-gantt-antd/lib/css/style.css'; */

// Import Not supported URLSearchParams
import 'library/search';

// Import root app
import App from 'containers/App';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';

// Load the favicon and the .htaccess file
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import 'file-loader?name=.htaccess!./.htaccess'; // eslint-disable-line import/extensions

import configureStore from './configureStore';

// Import i18n messages
import { translationMessages } from './i18n';

// ServiceWorker Event Handler
import swEventHanlder from './swEventHanlder';
// UnsupportedURLSearchParams();

// Create redux store with history
const initialState = {};
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');
// if (process.env.SENTRY_IO) {
//   try {
//     Sentry.init({
//       environment: process.env.NODE_ENV,
//       dsn: 'https://176707623eef4decbeb8cb409b8f99ad@sentry.io/1810607',
//     });
//   } catch (e) {
//     // ErrorLog.init();
//     // eslint-disable-next-line no-console
//     console.error(e);
//   }
// }

const render = messages => {
  ReactDOM.render(
    <Provider store={store}>
      <LanguageProvider messages={messages}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </LanguageProvider>
    </Provider>,
    MOUNT_NODE,
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n', 'containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise(resolve => {
    resolve(import('intl'));
  })
    .then(() =>
      Promise.all([
        import('intl/locale-data/jsonp/en.js'),
        import('intl/locale-data/jsonp/de.js'),
      ]),
    ) // eslint-disable-line prettier/prettier
    .then(() => render(translationMessages))
    .catch(err => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  const runtime = require('offline-plugin/runtime');
  const eventHandler = swEventHanlder(runtime, store);
  runtime.install(eventHandler); // eslint-disable-line global-require
}
