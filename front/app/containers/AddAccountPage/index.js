/**
 *
 * AddAccountPage
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { injectIntl, intlShape } from 'react-intl';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withTheme } from 'styled-components';

import Layout from 'components/Layout';

import Button from 'components/Button';
import Text from 'components/Text';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectAddAccountPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { linkAccount } from '../SettingsPage/actions';
import settingsSaga from '../SettingsPage/saga';
import messages from './messages';

export function AddAccountPage(props) {
  useInjectReducer({ key: 'addAccountPage', reducer });
  useInjectSaga({ key: 'addAccountPage', saga });
  useInjectSaga({ key: 'settingsPage', saga: settingsSaga });

  const { theme, onLinkAccount, intl } = props;

  return (
    <div>
      <Layout isFullPage>
        <Helmet>
          <title>{intl.formatMessage({ ...messages.addAccount })}</title>
          <meta name="description" content="Description of AddAccountPage" />
        </Helmet>
        {/* <FormattedMessage {...messages.header} /> */}
        <div className="text-center col-lg-5 mx-auto">
          <Text
            title
            text="TCMS"
            color={theme.primary}
            size={theme.fontSize.xxl}
            className="text-center"
          />
          <div className="pt-4">
            <div className="mt-3">
              <Text
                title
                text={intl.formatMessage({ ...messages.addSocMedProfile })}
              />
            </div>
            <div className="mt-2">
              <Text
                text={intl.formatMessage({ ...messages.connectProfiles })}
              />
            </div>
          </div>
          {/* TEMPORARY HIDE INSTAGRAM BUTTON */}
          {/* <div className="mt-5">
            <Button
              tertiaryInverted
              width="md"
              type="submit"
              className="twitter-user noAlign"
              onClick={onLinkAccount}
            >
              {intl.formatMessage({ ...messages.addTwitterProfile })}
            </Button>
          </div> */}
          <div className="row mt-5">
            <div className="col-auto mx-auto mb-3">
              <Button
                tertiaryInverted
                width="md"
                type="submit"
                className="twitter-user noAlign"
                onClick={() => onLinkAccount(1)}
              >
                {intl.formatMessage({ ...messages.addTwitterProfile })}
              </Button>
            </div>
            <div className="col-auto mx-auto mb-3">
              <Button
                tertiaryInverted
                width="md"
                type="submit"
                className="insta-user noAlign"
                onClick={() => onLinkAccount(2)}
              >
                {intl.formatMessage({ ...messages.addInstagramProfile })}
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

AddAccountPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  theme: PropTypes.any,
  onLinkAccount: PropTypes.func,
  intl: intlShape.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addAccountPage: makeSelectAddAccountPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLinkAccount: type => dispatch(linkAccount({ snsType: type })),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
  withTheme,
  injectIntl,
)(AddAccountPage);
