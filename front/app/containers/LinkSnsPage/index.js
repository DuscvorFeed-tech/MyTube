/* eslint-disable camelcase */
/**
 *
 * LinkSnsPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import LoadingIndicator from '../../components/LoadingIndicator';
import makeSelectLinkSnsPage, { makeSelectErrors } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { verifyTwitter } from './actions';
import MessageBox from '../../components/MessageBox';
import PATH from '../path';
import { forwardTo } from '../../helpers/forwardTo';

export function LinkSnsPage({
  routeParams,
  querystring,
  onVerifyTwitter,
  errors,
  onRemove,
}) {
  useInjectReducer({ key: 'linkSnsPage', reducer });
  useInjectSaga({ key: 'linkSnsPage', saga });

  const [type] = useState(routeParams.type);

  useEffect(() => {
    if (type) {
      if (type.toLowerCase() === 'twitter') {
        const requestToken = querystring.get('oauth_token');
        const verifierToken = querystring.get('oauth_verifier');
        onVerifyTwitter({ requestToken, verifierToken, type: 1 });
      } else if (type.toLowerCase() === 'instagram') {
        const requestToken = querystring.get('state');
        const verifierToken = querystring.get('code');
        onVerifyTwitter({ requestToken, verifierToken, type: 2 });
      }
    }
  }, [type]);

  if (errors) {
    return (
      <MessageBox showDelete onRemove={onRemove} invalid list={[errors]} />
    );
  }

  return <LoadingIndicator />;
}

LinkSnsPage.propTypes = {
  routeParams: PropTypes.object,
  onVerifyTwitter: PropTypes.func,
  querystring: PropTypes.any,
  errors: PropTypes.object,
  onRemove: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  linkSnsPage: makeSelectLinkSnsPage(),
  errors: makeSelectErrors(),
});

function mapDispatchToProps(dispatch) {
  return {
    onVerifyTwitter: values => dispatch(verifyTwitter(values)),
    onRemove: () => dispatch(forwardTo(PATH.SETTINGS_ACCOUNTS)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(LinkSnsPage);
