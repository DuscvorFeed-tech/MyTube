/* eslint-disable indent */
/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { compose } from 'redux';

import Img from 'components/Img';
import Text from 'components/Text';
import Button from 'components/Button';
// import IcoFont from 'react-icofont';
import A from 'components/A';

import TableList from 'components/TableList';
import ListContent from 'components/TableList/ListContent';

import { withTheme } from 'styled-components';
import { forwardTo } from 'helpers/forwardTo';
import { useInjectSaga } from 'utils/injectSaga';

import User from 'assets/images/icons/user_primary.png';

import StyledUserAccount from './StyledUserAccount';
import AdminLocal from '../../utils/AdminLocal';
import sagaSettingsPage from '../../containers/SettingsPage/saga';
import LocalStorage from '../../utils/localstorage';
import { SELECTED_SNS_ID } from '../../utils/constants';

import messages from './messages';
import PATH from '../../containers/path';
import useOutsideClick from './useOutsideClick';

function UserAccount(props) {
  useInjectSaga({ key: 'settingsPage', saga: sagaSettingsPage });

  const {
    theme,
    userAccount,
    intl,
    systemSettings,
    toggleAccount,
    setAccounts,
  } = props;
  // const { primary } = userAccount;
  const { sns_account_limit } = systemSettings;

  const ref = useRef();
  useOutsideClick(ref, () => {
    if (toggleAccount) {
      setAccounts(false);
    }
  });

  return (
    <StyledUserAccount>
      <div className="row align-items-center">
        <div className="col-12 h-42 text-right" ref={ref}>
          <Button
            className="align-sub"
            link
            onClick={() => setAccounts(!toggleAccount)}
          >
            <div className="row justify-content-between align-items-center">
              <div className="col pr-0 text-right">
                <div className="twitter-user">
                  <Text size={theme.fontSize.sm} text="Twitter" />
                </div>
              </div>
              <div className="col-4">
                <Img src={User} alt="user" className="circle1" />
              </div>
            </div>
          </Button>
          {toggleAccount && (
            <div className="userList">
              <TableList align="left">
                <ListContent>
                  <A
                    onClick={() => {
                      forwardTo('/profile');
                      setAccounts(!toggleAccount);
                    }}
                  >
                    {intl.formatMessage({
                      ...messages.viewProfile,
                    })}
                  </A>
                </ListContent>
              </TableList>
              {userAccount &&
                userAccount.sns_account.map(({ id, name, type }, index) => (
                  <TableList key={Number(index)}>
                    <ListContent align="left">
                      <Button
                        link
                        onClick={() => {
                          LocalStorage.writeLocalStorage(SELECTED_SNS_ID, id);
                          window.location.href = '/campaign';
                        }}
                      >
                        <div className="row justify-content-between align-items-center">
                          <div className="col pr-0 text-left">
                            <div
                              className={
                                type === 1
                                  ? 'twitter-user'
                                  : type === 2
                                  ? 'insta-user'
                                  : 'tiktok-user'
                              }
                            >
                              <Text size={theme.fontSize.sm} text={name} />
                            </div>
                          </div>
                          <div className="col-4">
                            <Img src={User} alt="user" className="circle" />
                          </div>
                        </div>
                      </Button>
                    </ListContent>
                  </TableList>
                ))}
              {/* LIMIT TO 3 SNS ACCOUNT */}
              {userAccount &&
                userAccount.sns_account.length < sns_account_limit && (
                  <TableList align="left">
                    <ListContent>
                      <Button link onClick={() => forwardTo(PATH.ADD_ACCOUNT)}>
                        {`+ ${intl.formatMessage({
                          ...messages.addAnotherAccount,
                        })}`}
                      </Button>
                    </ListContent>
                  </TableList>
                )}
              <TableList align="left">
                <ListContent>
                  <A
                    href="#"
                    onClick={() => {
                      AdminLocal.logout();
                      forwardTo('/login');
                    }}
                  >
                    {intl.formatMessage({
                      ...messages.logout,
                    })}
                  </A>
                </ListContent>
              </TableList>
            </div>
          )}
        </div>
      </div>
    </StyledUserAccount>
  );
}

UserAccount.propTypes = {
  setAccounts: PropTypes.func,
  toggleAccount: PropTypes.bool,
  theme: PropTypes.any,
  userAccount: PropTypes.object,
  intl: intlShape,
  systemSettings: PropTypes.object,
};

export default compose(
  withTheme,
  injectIntl,
)(UserAccount);
