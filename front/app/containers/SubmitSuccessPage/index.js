/**
 *
 * SubmitSuccessPage
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';

import { compose } from 'redux';
import { Helmet } from 'react-helmet';

import Layout from 'components/Layout';
// import Button from 'components/Button';
import IcoFont from 'react-icofont';

import { withTheme } from 'styled-components';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import Title from '../../components/Title';
import makeSelectSubmitSuccessPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

export function SubmitSuccessPage(props) {
  useInjectReducer({ key: 'submitSuccessPage', reducer });
  useInjectSaga({ key: 'submitSuccessPage', saga });

  const { intl } = props;

  return (
    <Layout isFullPage>
      <Helmet>
        <title>{intl.formatMessage({ ...messages.title })}</title>
        <meta name="description" content="Description of SessionExpiredPage" />
      </Helmet>
      <div className="text-center col-lg-5 mx-auto">
        <Title main className="text-center text-uppercase">
          {intl.formatMessage({ ...messages.headerTitle })}
        </Title>
        <h5 className="mt-4 mb-5">
          {intl.formatMessage({ ...messages.message })}
        </h5>
        <IcoFont
          icon="icofont-check-circled"
          style={{
            fontSize: '6.5em',
            marginRight: '0.5rem',
            color: '#1da1f2',
          }}
        />
        {/* <div className="row mt-5">
          <div className="col-md-5 mx-auto mb-3">
            <Button onClick={() => forwardTo(path)}>{buttonText}</Button>
          </div>
        </div> */}
      </div>
    </Layout>
  );
}

SubmitSuccessPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

const mapStateToProps = createStructuredSelector({
  submitSuccessPage: makeSelectSubmitSuccessPage(),
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
  withTheme,
  memo,
  injectIntl,
)(SubmitSuccessPage);
