/* eslint-disable react/prop-types */
import React, { lazy, Suspense } from 'react';
// import LoadingIndicator from 'components/LoadingIndicator';
import QueryString from '../library/context/querystring';
import { CommonTypesContext } from '../library/context/commonTypes';
import { UserAccountContext } from '../library/context/userAccount';
import { SystemSettingsContext } from '../library/context/systemSettings';

const loadable = (importFunc, { fallback = null } = { fallback: null }) => {
  const LazyComponent = lazy(importFunc);

  return props => (
    <Suspense fallback={fallback}>
      <QueryString.Consumer>
        {({ querystring }) => (
          <SystemSettingsContext.Consumer>
            {({ systemSettings }) => (
              <CommonTypesContext.Consumer>
                {({ commonTypes }) => (
                  <UserAccountContext.Consumer>
                    {({ userAccount }) => (
                      <LazyComponent
                        {...props}
                        querystring={querystring}
                        systemSettings={systemSettings}
                        commonTypes={commonTypes}
                        userAccount={userAccount}
                        routeParams={props.match.params}
                      />
                    )}
                  </UserAccountContext.Consumer>
                )}
              </CommonTypesContext.Consumer>
            )}
          </SystemSettingsContext.Consumer>
        )}
      </QueryString.Consumer>
    </Suspense>
  );
};

export default loadable;
