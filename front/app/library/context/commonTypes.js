/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect } from 'react';
import { GraphqlAPI } from '../../utils/request';

export const CommonTypesContext = createContext({
  commonTypes: {},
});

const CommonTypesProvider = ({ location, children }) => {
  const { pathname } = location || window.location;
  const [commonTypes, setCommonTypes] = useState({
    commonTypes: {},
  });
  const [underMaintenance, setUnderMaintenance] = useState(false);

  const fetchCommonTypes = async () => {
    const query = {
      query: `
      query {
        CommonTypes {
          type
          data {
            name,
            value
          }
        }
      }`,
    };
    const { success, CommonTypes, isMaintenance } = await GraphqlAPI(query);
    setUnderMaintenance(isMaintenance);
    if (success && CommonTypes) {
      let objTypes = {};
      CommonTypes.map(type => ({
        [type.type]: type.data,
      })).forEach(type => {
        objTypes = { ...objTypes, ...type };
      });
      setCommonTypes({ ...objTypes });
    }
  };

  useEffect(() => {
    fetchCommonTypes();
  }, [pathname]);

  return (
    !underMaintenance && (
      <CommonTypesContext.Provider value={{ commonTypes }}>
        {children}
      </CommonTypesContext.Provider>
    )
  );
};

export default CommonTypesProvider;
