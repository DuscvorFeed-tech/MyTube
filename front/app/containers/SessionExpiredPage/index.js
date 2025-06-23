/**
 *
 * SessionExpiredPage
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { intlShape, injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import Layout from 'components/Layout';
import Button from 'components/Button';
import IcoFont from 'react-icofont';

import { withTheme } from 'styled-components';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import Title from '../../components/Title';
import makeSelectSessionExpiredPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { forwardTo } from '../../helpers/forwardTo';
import PATH from '../path';
import messages from './messages';

export function SessionExpiredPage(props) {
  useInjectReducer({ key: 'sessionExpiredPage', reducer });
  useInjectSaga({ key: 'sessionExpiredPage', saga });

  const { intl } = props;

  useEffect(() => {
    getResultData();
  });

  const [title, setTitle] = useState(
    intl.formatMessage({ ...messages.sessionExpired }),
  );
  const [message, setMessage] = useState(
    intl.formatMessage({ ...messages.M0000043 }),
  );
  const [icon, setIcon] = useState('icofont-warning');
  const [path, setPath] = useState(PATH.LOGIN);
  const [buttonText, setButtonText] = useState(
    intl.formatMessage({ ...messages.login }),
  );
  const { result } = props.match.params;

  const getResultData = () => {
    if (result === 'expired') {
      setTitle(intl.formatMessage({ ...messages.sessionExpired }));
      setMessage(intl.formatMessage({ ...messages.M0000043 }));
      setIcon('icofont-warning');
      setButtonText(intl.formatMessage({ ...messages.login }));
      setPath(PATH.LOGIN);
    }
  };

  return (
    <Layout isFullPage>
      <Helmet>
        <title>{intl.formatMessage({ ...messages.sessionExpired })}</title>
        <meta name="description" content="Description of SessionExpiredPage" />
      </Helmet>
      <div className="text-center col-lg-5 mx-auto">
        <Title main className="text-center text-uppercase">
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

SessionExpiredPage.propTypes = {
  match: PropTypes.any,
  intl: intlShape,
};

const mapStateToProps = createStructuredSelector({
  sessionExpiredPage: makeSelectSessionExpiredPage(),
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
)(SessionExpiredPage);
