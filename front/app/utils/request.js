/* eslint-disable no-param-reassign */
import 'whatwg-fetch';
import axios from 'axios';
import * as Sentry from '@sentry/browser';
import jwt from 'jsonwebtoken';
import AdminLocal from './AdminLocal';
import { config } from './config';
import { forwardTo } from '../helpers/forwardTo';
import PATH from '../containers/path';
const showNetworkError = process.env.SHOW_NETWORK_ERROR;
const formDataJSON = require('formdata-json');
// import { logoutError } from '../containers/App/actions';

/**
 * Logout the user, removing the token in the storage
 *
 */
// export function Logout() {
//   LocalStorage.removeAuthStorage();
// }

const parseResponse = ({ response }, error = {}) => {
  if (response === undefined) {
    const { config: axiosConfig } = error;
    const msgDefault =
      'Possible error CORS or 502 Bad Gateway Error on API side.';
    const errMessage = error.stack || msgDefault;
    Sentry.captureException(new Error(errMessage));

    if (showNetworkError) {
      const networkError = {
        response: [`API URL: ${axiosConfig.url}`, errMessage],
      };
      forwardTo({ pathname: PATH.PAGE500, state: { networkError } });
    } else {
      forwardTo(PATH.PAGE500);
    }
    return { success: false };
  }
  const {
    status,
    data: { errors, extensions },
  } = response;
  // eslint-disable-next-line no-underscore-dangle
  const _errors = errors || extensions;
  if (status === 200 && !errors) {
    return { ...response.data, success: true };
  }

  if (response.status !== 200 || response.handled) {
    Sentry.addBreadcrumb({
      message: `Status Code: ${response.status || 'none'}`,
      data: response,
      level: Sentry.Severity.Info,
      category: 'API',
    });
  }

  if (_errors && _errors.length) {
    const { errorList, statusCode, stack, message } = _errors[0];
    if (statusCode === 401 || status === 401) {
      // forwardTo(PATH.ERROR408);
      // forwardTo(PATH.PAGE404);
      const token = AdminLocal.getAdminToken();
      AdminLocal.logout();
      if (
        ![PATH.LOGIN_EXPIRED, PATH.LOGIN].includes(window.location.pathname)
      ) {
        if (token) {
          forwardTo(PATH.LOGIN_EXPIRED);
        } else {
          forwardTo(PATH.LOGIN);
        }
      }
    }
    if (errorList) {
      const list = errorList.map(props => {
        const { key, errorCode } = props;
        return {
          [key]: errorCode,
          errorCode,
          field: key,
          formatIntl: { id: errorCode, name: key, state: props },
        };
      });

      return {
        errors: { ...list[0], list, default: _errors },
        success: false,
      };
    }
    if (statusCode === 500) {
      const errMessage =
        (stack && stack.join('\n')) || message || JSON.stringify(errors);
      Sentry.captureException(new Error(errMessage));

      if (showNetworkError) {
        const networkError = {
          request: createRequestMessage(error),
          response: [errMessage],
        };
        forwardTo({ pathname: PATH.PAGE500, state: { networkError } });
      } else {
        forwardTo(PATH.PAGE500);
      }
    }
    if (statusCode === 503) {
      window.location.replace('/maintenance.html');
      return { success: false, isMaintenance: true };
    }
    // Video Twitter Post
    try {
      return {
        errors: _errors.map(e => ({
          errorCode: e.errorCode,
          formatIntl: {
            id: e.errorCode,
            values: {},
          },
        })),
        success: false,
      };
    } catch (err) {
      // console.log(err);
    }
  }

  return { errors: _errors, success: false };
};

const createRequestMessage = error => {
  const { config: axiosConfig = {} } = error;
  return [
    `Page URL: ${window.location.href}`,
    `API URL: ${axiosConfig.url}`,
    `Method: ${axiosConfig.method}`,
    `Data: ${axiosConfig.data}`,
    `headers: ${JSON.stringify(axiosConfig.headers)}`,
  ];
};

const instance = axios.create({
  baseURL: config.API_URL,
});
// Add a response interceptor
instance.interceptors.response.use(
  response =>
    // Do something with response data
    parseResponse({ response }),
  error =>
    // Do something with response error
    parseResponse(error, error && error.toJSON()),
);

const appKey = 'cCch@nn3lS3cr3tKeyxXxcCc';
const secret =
  'MIIBOQIBAAJBAKiiwK4vcIYbknFa1+ptI50KJHjHDgOOvCnYBbmeJavArehlNea8' +
  'T9yRTdDKf+2BlYaYk0uUfq0xafaWNGnepP0CAwEAAQJAcc/+KNEdqXUcXeLIzI/C' +
  'NG+u89CsVZxUxAzmuELS+9njPnz2J+S07aSBDd4D9OjLM0zXdCdtwwkIH7w3vDL+' +
  'hQIhANRbVbx20hkOcOSKX9bpfMfikgGKS7qtvqJ+pSekA4d3AiEAy0si4gYCtwC6' +
  'D8U7jersoIS+DLj5QNxu8lz8YTJxPCsCIB7VlEFlT2RsAGBu5zOhe4jakTDAD/bv' +
  'O3sEwJ5c5lZJAiAZxWiipohpkpoDrcki8IkWwD0nd7uBUXBvIQKNf8uDCQIgBvdM' +
  'Dhzyj/S82Y9m1JK/No9l7Sb9eLGP4cAE1cTjj3U=';

function jwtToken(payload) {
  const token = jwt.sign(payload, secret);
  return token;
}

function XAuthorization(data, headers) {
  const token = jwtToken({ appKey });
  headers['Content-Type'] = 'application/json;charset=utf-8';
  headers.Authorization = `Bearer ${token}`;
  return JSON.stringify(data);
}

function Authorization(data, headers) {
  const token = AdminLocal.getAdminToken();
  headers['Content-Type'] = 'application/json;charset=utf-8';
  headers.Authorization = `Bearer ${token}`;
  return JSON.stringify(data);
}

function AuthorizationFormData(data, headers) {
  const token = AdminLocal.getAdminToken();
  headers['Content-Type'] = 'application/json;charset=utf-8';
  headers.Authorization = `Bearer ${token}`;
  return data;
}

function AuthFormUpload(data, headers) {
  const token = AdminLocal.getAdminToken();
  headers['Content-Type'] = 'multipart/form-data;charset=utf-8';
  headers.Authorization = `Bearer ${token}`;
  return data;
}

const GraphqlAPI = (data, transformRequest) =>
  instance.post(config.GRAPH_URL, data, { transformRequest }).then(res => res);

/**
 * For REST API request
 * @param {*} data body
 * @param {*} route route
 * @param {*} isForm set true if using form data
 */
const NativeAPI = (data, route, isForm = false) =>
  instance
    .post(route, formDataJSON(data), {
      transformRequest: !isForm ? Authorization : AuthFormUpload,
    })
    .then(res => res);

const FormUploadAPI = (url, data) =>
  instance
    .post(url, data, { transformRequest: AuthFormUpload })
    .then(res => res);

// added for update
const FormUploadUpdateAPI = (url, data) =>
  instance
    .put(url, data, { transformRequest: AuthFormUpload })
    .then(res => res);

const NativeAPIFormData = (data, route) =>
  instance
    .post(route, data, {
      transformRequest: AuthorizationFormData,
    })
    .then(res => res);

const NativeAPIAuthorizedGet = route =>
  instance
    .get(route, {
      transformRequest: AuthorizationFormData,
    })
    .then(res => res);

export {
  GraphqlAPI,
  XAuthorization,
  Authorization,
  FormUploadAPI,
  FormUploadUpdateAPI,
  NativeAPI,
  NativeAPIFormData,
  NativeAPIAuthorizedGet,
};
