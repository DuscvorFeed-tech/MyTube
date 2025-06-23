/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/button-has-type */
/* eslint-disable indent */
/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { compose } from 'redux';
import { forwardTo } from 'helpers/forwardTo';
import './Header.scss';
// import { Image, Form, Input, Icon, Button, Menu } from 'semantic-ui-react';
// import { Link } from 'react-router-dom';
// import UserAccount from 'components/UserAccount';
import AdminLocal from 'utils/AdminLocal';
import LanguageSelector from 'components/LanguageSelector';
// import logo from 'assets/images/common/logo.png';
import logo from 'assets/images/common/logo.svg';
import {
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaSignInAlt,
} from 'react-icons/fa';
// import AdminLocal from '../../utils/AdminLocal';
import messages from './messages';

function Header(props) {
  // const { userAccount, toggleSideBar, showSidebar, intl } = props;
  // const [isOpen, setIsOpen] = useState(false);
  const { userAccount, intl } = props;
  const onclickSearch = () => {
    const searchText = document.getElementsByName('keyword')[0].value;
    forwardTo(`/search/${searchText}`);
  };
  const onclickMenu = () => {
    const searchText = document.getElementsByName('keyword')[0].value;
    forwardTo(`/menu=${searchText}`);
  };

  const navStatus = () => {
    if (document.body.classList.contains('hamburger-active')) {
      navClose();
    } else {
      navOpen();
    }
  };

  const navOpen = () => {
    console.log(AdminLocal.getUserId() !== '');
    document.body.classList.add('hamburger-active');
    document.getElementById('sidenav').style.display = 'block';
  };

  const navClose = () => {
    document.body.classList.remove('hamburger-active');
    document.getElementById('sidenav').style.display = 'none';
  };

  return (
    <header>
      <div className="top-navbar">
        <div className="container-fluid container-top-navbar">
          <div className="row">
            <div className="div-left">
              <div className="logo">
                <a href="/">
                  <img src={logo} alt="logo" />
                </a>
              </div>

              <div className="search-container">
                <form>
                  <input
                    type="text"
                    placeholder={intl.formatMessage({ ...messages.search })}
                    name="keyword"
                  />
                  <button onClick={() => onclickSearch()}>
                    <FaSearch />
                  </button>
                </form>
              </div>
            </div>

            <div className="div-right">
              <a
                onClick={() => {
                  if (AdminLocal.getUserId() === '' ) {
                    forwardTo('/login');
                  } else {
                    forwardTo('/upload');
                  }
                  return false;
                }}
              >
                <div className="image-7" />
              </a>
              <div className="select-language">
                <LanguageSelector />
              </div>
              <div
                className="image-6"
                onClick={() => {
                   navStatus();
                }}
              />
            </div>
          </div>
        </div>
        <div id="sidenav">
          <ul className="ul-sidenav">
            {AdminLocal.getUserId() === '' && (
              <li>
                <a href="/login">
                  <FaSignInAlt type="fas" className="icons" />
                  <span>Login</span>
                </a>
              </li>
            )}

            {/* <li>
              {userAccount !== null && (
                <a href="/mypage">
                  <FaUserCircle type="fas" className="icons" />
                  <span>My Page</span>
                </a>
              )}
            </li> */}
            {AdminLocal.getUserId() !== '' && (
              <li>
                <a href="/mypage">
                  <FaUserCircle type="fas" className="icons" />
                  <span>My Page</span>
                </a>
              </li>
            )}

            {AdminLocal.getUserId() !== '' && (
              <li>
                <a
                  onClick={() => {
                    AdminLocal.logout();
                    forwardTo('/');
                    window.location.reload();
                    return false;
                  }}
                >
                  <FaSignOutAlt type="Fas" className="icons" />
                  <span>Sign-out</span>
                </a>
              </li>
            )}
          </ul>
        </div>
        <div className="container-fluid mobile">
          <div className="row">
            <div className="div-left">
              <div className="logo">
                <a href="/">
                  <img src={logo} alt="logo" />
                </a>
              </div>
            </div>

            <div className="div-right">
              {/* {userAccount && ( */}
              <div className="video-upload">
                <a
                  onClick={() => {
                    if (AdminLocal.getUserId() === '') {
                      forwardTo('/login');
                    } else {
                      forwardTo('/upload');
                    }
                    return false;
                  }}
                >
                  <div className="image-7" />
                </a>
              </div>
              {/* )} */}
              <div className="select-language">
                <LanguageSelector />
              </div>
              <div className="item-login">
                <a
                  onClick={() => {
                    navStatus();
                  }}
                >
                  <div className="image-6" />
                </a>
              </div>
            </div>
          </div>
          <div>
            {/* <div className="search-container">
                <form>
                  <input
                    type="text"
                    placeholder={intl.formatMessage({ ...messages.search })}
                    name="keyword"
                  />
                  <button onClick={() => onclickSearch()}>
                    <FaSearch />
                  </button>
                </form>
              </div> */}
          </div>
        </div>
      </div>

      <div className="sidebar">
        <ul>
          <li>
            <a href="/" className="active">
              <div className="image-1e" />
              <div className="menu-label">Home</div>
            </a>
          </li>
          <li>
            <a href="/">
              <div className="image-20" />
              <div
                className="menu-label"
                onClick={() => {
                  forwardTo('/?menu=trending');
                }}
              >
                Trending
              </div>
            </a>
          </li>
          <li>
            <a href="/">
              <div className="image-21" />
              <div className="menu-label">Liked</div>
            </a>
          </li>
        </ul>
        <div className="you">You</div>
        <ul>
          <li>
            <a href="/">
              <div className="image-1e" />
              <div className="menu-label">History</div>
            </a>
          </li>
          <li>
            <a href="/">
              <div className="image-25" />
              <div className="menu-label">Your Videos</div>
            </a>
          </li>
          <li>
            <a href="/">
              <div className="image-28" />
              <div className="menu-label">Wallet</div>
            </a>
          </li>
        </ul>
      </div>

      <div className="bottom-navbar">
        <ul>
          <li>
            <a href="/" className="active">
              <div className="image-1e" />
            </a>
          </li>
          <li>
            <a href="/">
              <div className="image-20" />
            </a>
          </li>
          <li>
            <a href="/">
              <div className="image-21" />
            </a>
          </li>
          <li>
            <a href="/">
              <div className="image-25" />
            </a>
          </li>
          <li>
            <a href="/">
              <div className="image-28" />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}

Header.propTypes = {
  // setAccounts: PropTypes.func,
  // toggleAccount: PropTypes.bool,
  userAccount: PropTypes.object,
  intl: intlShape,
  // systemSettings: PropTypes.object,
};

export default compose(injectIntl)(Header);
