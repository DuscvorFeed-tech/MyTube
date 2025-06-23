/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect } from 'react';
import { GraphqlAPI, Authorization } from '../../utils/request';

export const SystemSettingsContext = createContext({
  systemSettings: {},
});

const SystemSettingsProvider = ({ location, children }) => {
  const { pathname } = location || window.location;
  const [systemSettings, setSystemSettings] = useState({});

  const fetchSystemSettings = async () => {
    const query = {
      query: `
      query{
        SystemSettings{
            sns_account_limit 
            hashtag_limit 
            campaign_hashtag_limit 
            campaign_retweet_limit 
        }
      }`,
    };
    const data = await GraphqlAPI(query, Authorization);
    if (data.success && data.SystemSettings) {
      setSystemSettings(data.SystemSettings);
    }
  };

  useEffect(() => {
    fetchSystemSettings();
  }, [pathname]);

  return (
    <SystemSettingsContext.Provider value={{ systemSettings }}>
      {children}
    </SystemSettingsContext.Provider>
  );
};

export default SystemSettingsProvider;
