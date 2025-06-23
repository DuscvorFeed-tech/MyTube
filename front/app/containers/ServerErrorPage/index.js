/**
 *
 * ServerErrorPage
 *
 */

import React, { memo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { injectIntl, intlShape } from 'react-intl';
import { compose } from 'redux';

import Layout from 'components/Layout';
// import Button from 'components/Button';
import Alert from 'components/Alert';
import Label from 'components/Label';
import IcoFont from 'react-icofont';
import Title from 'components/Title';

// import { forwardTo } from 'helpers/forwardTo';
// import PATH from '../path';

import messages from './messages';

export function ServerErrorPage(props) {
  const { intl, location } = props;
  const networkError = location.state && location.state.networkError;
  return (
    <Layout isFullPage>
      <Helmet>
        <title>{intl.formatMessage({ ...messages.T0000029 })}</title>
        <meta name="description" content="Description of ServerErrorPage" />
      </Helmet>
      <div className="text-center col-lg-5 mx-auto">
        <Title main className="text-center mb-3">
          {intl.formatMessage({ ...messages.T0000028 })}
        </Title>
        <IcoFont
          icon="icofont-warning"
          style={{
            fontSize: '6.5em',
            marginRight: '0.5rem',
            color: '#1da1f2',
          }}
        />
        <h5 className="mt-4 mb-5">
          {intl.formatMessage({ ...messages.M0000053 })}
        </h5>
      </div>
      {networkError && (
        <Alert
          networkErrorLog
          id="errorLog"
          className="mb-3 alert alert alert-danger alert-networkLogs"
        >
          <Title main className="text-center">
            Network Error
          </Title>
          {networkError.request && (
            <div>
              <Label>Request</Label>
              {networkError.request.map((error, index) => (
                <p key={Number(index)} className="pl-4">
                  {error.replace(/\\n/g, ' ')}
                </p>
              ))}
            </div>
          )}
          {networkError.request && networkError.response && <hr />}
          {networkError.response && (
            <div>
              <Label>Response</Label>
              {networkError.response.map(error => (
                <p className="pl-4">
                  {error.split('\n').map(msg => (
                    <Fragment>
                      {msg} <br />
                    </Fragment>
                  ))}
                </p>
              ))}
            </div>
          )}
        </Alert>
      )}
    </Layout>
  );
}

ServerErrorPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  intl: intlShape,
  location: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
  injectIntl,
)(ServerErrorPage);
