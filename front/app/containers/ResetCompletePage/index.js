/**
 *
 * ResetCompletePage
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { injectIntl } from 'react-intl';
// import { FormattedHTMLMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import Layout from 'components/Layout';
import Button from 'components/Button';
import IcoFont from 'react-icofont';

import { withTheme } from 'styled-components';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import Title from '../../components/Title';
import makeSelectResetCompletePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { forwardTo } from '../../helpers/forwardTo';
import PATH from '../path';
import messages from './messages';

export function ResetCompletePage(props) {
  useInjectReducer({ key: 'resetCompletePage', reducer });
  useInjectSaga({ key: 'resetCompletePage', saga });

  useEffect(() => {
    getResultData();
  });

  const { intl } = props;
  const [title, setTitle] = useState(
    intl.formatMessage({ ...messages.resetSuccess }),
  );
  const [message, setMessage] = useState(
    intl.formatMessage({ ...messages.resetSuccessMsg }),
  );
  const [icon, setIcon] = useState('icofont-check-circled');
  const [path, setPath] = useState(PATH.LOGIN);
  const [buttonText, setButtonText] = useState(
    intl.formatMessage({ ...messages.login }),
  );
  const { result } = props.match.params;

  const getResultData = () => {
    if (result === 'success') {
      setTitle(intl.formatMessage({ ...messages.resetSuccess }));
      setMessage(intl.formatMessage({ ...messages.resetSuccessMsg }));
      setIcon('icofont-check-circled');
      setButtonText(intl.formatMessage({ ...messages.login }));
      setPath(PATH.LOGIN);
    } else if (result === 'expired') {
      setTitle(intl.formatMessage({ ...messages.resetLinkExpired }));
      setMessage(intl.formatMessage({ ...messages.resetLinkExpiredInvalid }));
      setIcon('icofont-check-circled');
      setButtonText(intl.formatMessage({ ...messages.goToForgotPassword }));
      setPath(PATH.FORGOT_PASSWORD);
    }
  };

  return (
    <Layout isFullPage>
      <Helmet>
        <title>{intl.formatMessage({ ...messages.resetComplete })}</title>
        <meta name="description" content="Description of ResetCompletePage" />
      </Helmet>
      <div className="text-center col-lg-5 mx-auto">
        <Title main className="text-center">
          {title}
        </Title>
        <h5 className="mt-4 mb-5">{message}</h5>
        <IcoFont
          icon={icon}
          style={{
            fontSize: '6.5em',
            marginRight: '0.5rem',
            color: '#1da1f2',
          }}
        />
        <div className="row mt-5">
          <div className="col-md-5 mx-auto mb-3">
            <Button onClick={() => forwardTo(path)}>{buttonText}</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

ResetCompletePage.propTypes = {
  match: PropTypes.any,
  intl: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  resetCompletePage: makeSelectResetCompletePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
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
)(ResetCompletePage);
