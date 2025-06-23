/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-rest-params */
/* eslint-disable func-names */
import api from './api';

export const Console = (function(winsole) {
  // eslint-disable-next-line no-param-reassign
  window.__SCMS__GLOBAL__ = { ...window.__SCMS__GLOBAL__, console: winsole };
  const error = function() {
    winsole.error.apply(...arguments);

    const args = [];
    for (let _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    api.post({ error: args.join(' ') });
  };

  return { ...winsole, error };
})(window.console);
