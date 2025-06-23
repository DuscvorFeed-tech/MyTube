import { createContext } from 'react';

export default createContext({
  querystring: new URLSearchParams(window.location && window.location.search),
});
