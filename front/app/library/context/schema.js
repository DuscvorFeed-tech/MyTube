/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react';

const defaultSchema = {
  version: SWVERSION,
  loading:
    !(SWVERSION === undefined || SWVERSION === '') &&
    'serviceWorker' in navigator,
  updating: false,
};

export const SchemaContext = createContext(defaultSchema);

const SchemaProvider = ({ children }) => {
  const [schema, setSchema] = useState(defaultSchema);
  const fetchSchema = async version => {
    const response = await axios.get(`/api/schema`).catch(error => error);
    const { data } = response;
    if (data) {
      if (data.version === version) {
        setSchema({ loading: false });
      } else {
        setSchema({ ...schema, updating: true });
      }
    } else if ('serviceWorker' in navigator) {
      // eslint-disable-next-line no-console
      console.log('Server down uninstall SW');
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
        });
        window.location.reload();
      });
    }
  };

  useEffect(() => {
    if (schema.version) {
      fetchSchema(schema.version);
    }
  }, []);

  return (
    <SchemaContext.Provider value={schema}>{children}</SchemaContext.Provider>
  );
};

export default SchemaProvider;
