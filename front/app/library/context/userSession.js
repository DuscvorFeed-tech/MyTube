/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect } from 'react';
import AdminLocal from '../../utils/AdminLocal';
import PATH from '../../containers/path';
import { NativeAPIAuthorizedGet } from '../../utils/request';
const { config } = require('../../utils/config');

export const UserSessionContext = createContext({
  valid: null,
  userAccount: null,
});

const UserSessionProvider = ({ location, children }) => {
  const { pathname } = location || window.location;
  // const [userAccount, setUserAccount] = useState({
  //   userAccount: null,
  // });
  const [userSession, setUserSession] = useState({
    valid: null,
  });
  const [userAccount, setUserAccount] = useState({
    userAccount: null,
  });

  const validateSession = async () => {
    const data = await NativeAPIAuthorizedGet(config.USER_PROFILE);
    if (pathname !== PATH.LOGIN) {
      AdminLocal.savePagePath(pathname);
    }
    if (data.success) {
      setUserAccount({ userAccount: { ...data } });
      setUserSession({ valid: true });
    } else {
      setUserAccount({ userAccount: false });
      setUserSession({ valid: false });
    }
  };

  useEffect(() => {
    validateSession();
  }, [pathname]);

  return (
    <UserSessionContext.Provider value={{ ...userSession, ...userAccount }}>
      {children}
    </UserSessionContext.Provider>
  );
};

export default UserSessionProvider;
