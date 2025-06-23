/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect } from 'react';
import { config } from 'utils/config';
import { NativeAPIAuthorizedGet } from '../../utils/request';

export const UserAccountContext = createContext({
  userAccount: { sns_account: [] },
  userLoaded: false,
  userRefresh: null,
});

const UserAccountProvider = ({ location, children }) => {
  const { pathname } = location || window.location;
  const [userAccount, setUserAccount] = useState({
    userAccount: null,
  });
  const [userLoaded, setUserLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const fetchUserDetail = async () => {
    const apiResponse = await NativeAPIAuthorizedGet(config.USER_PROFILE);

    if (apiResponse && apiResponse.success === true && apiResponse.data) {
      setUserAccount({ userAccount: { ...apiResponse.data } });
      setUserLoading(true);
    }

    if (apiResponse && !apiResponse.success) {
      setUserAccount({ userAccount: false });
      setUserLoading(true);
    }
  };

  const userRefresh = () => setRefresh(refresh + 1);

  useEffect(() => {
    fetchUserDetail();
  }, [pathname]);

  useEffect(() => {
    if (refresh > 0) {
      fetchUserDetail();
    }
  }, [refresh]);

  return (
    <UserAccountContext.Provider
      value={{ ...userAccount, userLoaded, userRefresh }}
    >
      {children}
    </UserAccountContext.Provider>
  );
};

export default UserAccountProvider;
