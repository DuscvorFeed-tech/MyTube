import AdminLocal from '../utils/AdminLocal';

export function RequestOptions(Method, request = {}) {
  let requestOptions;

  if (Method === 'GET') {
    requestOptions = {
      method: Method,
      headers: { 'Content-Type': 'application/json' },
    };
  } else {
    requestOptions = {
      method: Method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    };
  }

  const token = AdminLocal.getTokenInfo();
  if (token) {
    requestOptions.headers = {
      ...requestOptions.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return requestOptions;
}

export function ImageRequestOptions(Method, request) {
  const token = AdminLocal.getTokenInfo();

  const requestOptions = {
    method: Method,
    headers: { Authorization: `Bearer ${token.adminToken}` },
    body: request,
  };
  return requestOptions;
}
