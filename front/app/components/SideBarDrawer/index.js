/* eslint-disable no-unused-vars */
/**
 *
 * Sidebar
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
// import { NavLink } from 'react-router-dom';
import { forwardTo } from 'helpers/forwardTo';
import { compose } from 'redux';
import { Icon, Header } from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
// import PATH from 'containers/path';

// import Button from 'components/Button';
// import messages from './messages';
import AdminLocal from '../../utils/AdminLocal';
import { StyledSidebarDrawer } from './StyledSidebarDrawer';
const { BETA_CONTENT } = NOCONTENT;

function SideBarDrawer(props) {
  const {
    className,
    location,
    showSidebarDrawer,
    setAccounts,
    userAccount,
  } = props;
  // const toggleSubMenu = e => {
  //   const subMenuParent = e.target;
  //   subMenuParent.classList.toggle('subMenu--active');
  //   subMenuParent.nextElementSibling.classList.toggle('subMenu--active');
  // };

  const snsType = 1; // userAccount.primary && userAccount.primary.type;

  const isActiveParent = path => {
    const rg = new RegExp(`^\\${path}`);
    let condition = false;
    if (location.pathname === '/' && path === '/') {
      condition = true;
    } else if (location.pathname.match(rg) && path !== '/') {
      condition = true;
    }

    return condition;
  };
  // const isActiveSub = path => {
  //   const rg = new RegExp(`^\\${path}`);
  //   if (location.pathname.match(rg)) {
  //     return true;
  //   }
  //   return false;
  // };
  return (
    <React.Fragment>
      <StyledSidebarDrawer
        id="sidebarDrawer"
        className={`sidebarDrawer ${className}`}
        showSidebar={showSidebarDrawer}
      >
        <ul>
          {snsType === 1 && (
            <li className="parentMenu">
              <button
                type="button"
                className={`noSubMenu ${
                  isActiveParent('/') ? 'active subMenu--active' : ''
                }`}
                onClick={() => {
                  setAccounts(false);
                  forwardTo('/');
                }}
                dataToggle="tooltip"
                dataPlacement="top"
                title={props.intl.formatMessage({
                  id: 'boilerplate.components.Header.home',
                })}
              >
                <Icon name="home" size="large" />
                <span>
                  {props.intl.formatMessage({
                    id: 'boilerplate.components.Header.home',
                  })}
                </span>
              </button>
            </li>
          )}
          {userAccount && (
            <li className="parentMenu">
              <button
                type="button"
                className={`noSubMenu ${
                  isActiveParent(`/upload`) ? 'active subMenu--active' : ''
                }`}
                onClick={() => {
                  setAccounts(false);
                  forwardTo(`/upload`);
                }}
                dataToggle="tooltip"
                dataPlacement="top"
                title={props.intl.formatMessage({
                  id: 'upload',
                })}
              >
                <Icon name="upload" size="large" />
                <span>{props.intl.formatMessage({ id: 'upload' })}</span>
              </button>
            </li>
          )}
          <li className="parentMenu">
            <button
              type="button"
              className={`noSubMenu ${
                isActiveParent('/hot') ? 'active subMenu--active' : ''
              }`}
              /*               onClick={() => {
                setAccounts(false);
                forwardTo('/hot');
              }} */
              dataToggle="tooltip"
              dataPlacement="top"
              title={props.intl.formatMessage({
                id: 'hot',
              })}
            >
              <Icon name="fire" size="large" />
              <span>{props.intl.formatMessage({ id: 'hot' })}</span>
            </button>
          </li>
          <li className="parentMenu">
            <button
              type="button"
              className={`noSubMenu ${
                isActiveParent('/hot') ? 'active subMenu--active' : ''
              }`}
              /*               onClick={() => {
                setAccounts(false);
                forwardTo('/hot');
              }} */
              dataToggle="tooltip"
              dataPlacement="top"
              title={props.intl.formatMessage({
                id: 'trending',
              })}
            >
              <Icon name="line graph" size="large" />
              <span>{props.intl.formatMessage({ id: 'trending' })}</span>
            </button>
          </li>
          {userAccount && (
            <li className="parentMenu">
              <button
                type="button"
                className={`noSubMenu ${
                  isActiveParent('/watchlater') ? 'active subMenu--active' : ''
                }`}
                /*               onClick={() => {
                  setAccounts(false);
                  forwardTo('/hot');
                }} */
                dataToggle="tooltip"
                dataPlacement="top"
                title={props.intl.formatMessage({
                  id: 'watchLater',
                })}
              >
                <Icon name="clock" size="large" />
                <span>{props.intl.formatMessage({ id: 'watchLater' })}</span>
              </button>
            </li>
          )}
          {userAccount && (
            <li className="parentMenu">
              <button
                type="button"
                className={`noSubMenu ${
                  isActiveParent(`/channel`) ? 'active subMenu--active' : ''
                }`}
                onClick={() => {
                  setAccounts(false);
                  forwardTo(`/channel`);
                }}
              >
                <Icon name="file video outline" size="large" />
                <span>{props.intl.formatMessage({ id: 'channel' })}</span>
              </button>
            </li>
          )}
          {userAccount && (
            <li className="parentMenu">
              <button
                type="button"
                className={`noSubMenu ${
                  isActiveParent('/settings') ? 'active subMenu--active' : ''
                }`}
                /*  onClick={() => {
                  setAccounts(false);
                  forwardTo('/settings');
                }} */
                dataToggle="tooltip"
                dataPlacement="top"
                title={props.intl.formatMessage({ id: 'T0000023' })}
              >
                <Icon name="setting" size="large" />
                <span>{props.intl.formatMessage({ id: 'T0000023' })}</span>
              </button>
            </li>
          )}
          {userAccount && (
            <li className="parentMenu">
              <button
                type="button"
                className={`noSubMenu ${
                  isActiveParent('/logout') ? 'active subMenu--active' : ''
                }`}
                onClick={() => {
                  AdminLocal.logout();
                  window.location.reload();
                }}
              >
                <Icon name="logout" size="large" />
                <span>{props.intl.formatMessage({ id: 'logout' })}</span>
              </button>
            </li>
          )}
        </ul>
      </StyledSidebarDrawer>
    </React.Fragment>
  );
}

SideBarDrawer.propTypes = {
  className: PropTypes.string,
  location: PropTypes.object,
  showSidebarDrawer: PropTypes.bool,
  setAccounts: PropTypes.func,
  intl: PropTypes.any,
  userAccount: PropTypes.object,
};

export default compose(
  memo,
  injectIntl,
  withTheme,
)(SideBarDrawer);
