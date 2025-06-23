/* eslint-disable no-unused-vars */
/**
 *
 * Layout
 *
 */

import React, { Children, memo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import Header from 'components/Header';
import Alert from 'components/Alert';
import Button from 'components/Button';
import Label from 'components/Label';
import { makeSelectShowUpdateSw } from 'containers/App/selectors';
import StyledLayout from './StyledLayout';

function Layout(props) {
  // eslint-disable-next-line prefer-const
  let [showSidebar, setshowSidebar] = useState(false);
  const [toggleAccount, setAccounts] = useState(false);
  const toggleSideBar = () => {
    // document.body.classList.toggle('show-sidebar');
    setshowSidebar((setshowSidebar = !showSidebar));
  };

  const {
    className,
    children,
    isFullPage,
    location,
    userAccount,
    dispatch,
    showUpdateSw,
    systemSettings,
  } = props;
  // eslint-disable-next-line prefer-const
  let [activeTab, setActiveTab] = useState(1);

  return (
    <StyledLayout
      className={className}
      isFullPage={isFullPage}
      showSidebar={false}
    >
      {!isFullPage && (
        <div>
          <Header
            // dispatch={dispatch}
            userAccount={userAccount}
            // systemSettings={systemSettings}
            // toggleAccount={toggleAccount}
            // setAccounts={setAccounts}
          />

          {showUpdateSw && (
            <Alert
              noclose
              id="notif"
              className="mb-3 alert alert-secondary alert-settings"
            >
              <Label className="d-inline">
                A new content of this website is available, please refresh the
                page to update or click the reload button.{' '}
              </Label>
              <Button
                small
                secondary
                className="col-1 mr-auto d-inline ml-4"
                dataDismiss="modal"
                onClick={() => window.location.reload()}
              >
                Reload
              </Button>
            </Alert>
          )}

          {false && (
            <Alert
              networkErrorLog
              id="errorLog"
              className="mb-3 alert alert alert-danger alert-networkLogs"
            >
              <div>
                <Label>Request</Label>
                <p className="pl-4">Request Content</p>
              </div>
              <hr />
              <div>
                <Label>Response</Label>
                <p className="pl-4">Request Content</p>
              </div>
            </Alert>
          )}
        </div>
      )}

      <div className="wrapper-main">{Children.toArray(children)}</div>
      {showUpdateSw && (
        <Alert
          noclose
          id="notif"
          className="mb-3 alert alert-secondary alert-settings"
        >
          <Label className="d-inline">
            A new content of this website is available, please refresh the page
            to update or click the reload button.{' '}
          </Label>
          <Button
            small
            secondary
            className="col-1 mr-auto d-inline ml-4"
            dataDismiss="modal"
            onClick={() => window.location.reload()}
          >
            Reload
          </Button>
        </Alert>
      )}
    </StyledLayout>
  );
}

Layout.propTypes = {
  isFullPage: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  location: PropTypes.object,
  userAccount: PropTypes.object,
  dispatch: PropTypes.func,
  showUpdateSw: PropTypes.bool,
  systemSettings: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  showUpdateSw: makeSelectShowUpdateSw(),
});

const withConnect = connect(mapStateToProps);

// export default memo(Layout);
export default compose(
  withConnect,
  memo,
)(Layout);
