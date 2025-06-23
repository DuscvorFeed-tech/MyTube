/* eslint-disable no-underscore-dangle */
import axios from 'axios';

const API = {
  post: error => {
    axios.post('/api/logs/error', { error }).catch(e => {
      const cons = window.__SCMS__GLOBAL__.console || console;
      cons.error(e);
    });
  },
};

export default API;
