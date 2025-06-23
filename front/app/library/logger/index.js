/* eslint-disable no-underscore-dangle */
import { Console } from './methods';
import api from './api';
window.__SCMS__GLOBAL__ = {};
// const scmsGlobal = window.__SCMS__GLOBAL__;

export const init = () => {
  window.console = Console;
};

export const captureAsException = error => {
  api.post(error);
};
