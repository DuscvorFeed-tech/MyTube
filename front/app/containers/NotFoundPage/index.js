/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import { injectIntl, intlShape } from 'react-intl';
import Layout from 'components/Layout';
// import Button from 'components/Button';
import IcoFont from 'react-icofont';
import Title from 'components/Title';

// import { forwardTo } from 'helpers/forwardTo';
// import PATH from '../path';

import messages from './messages';

export function NotFound(props) {
  const { intl } = props;
  return (
    <Layout isFullPage>
      <Helmet>
        <title>{intl.formatMessage({ ...messages.T0000027 })}</title>
        <meta name="description" content="Description of NotFoundPage" />
      </Helmet>
      <div className="text-center col-lg-5 mx-auto">
        <Title main className="text-center mb-3">
          {intl.formatMessage({ ...messages.T0000026 })}
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
          {intl.formatMessage({ ...messages.M0000052 })}
        </h5>
      </div>
    </Layout>
  );
}

NotFound.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  intl: intlShape,
};

export default compose(injectIntl)(NotFound);
