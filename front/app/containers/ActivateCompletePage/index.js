/**
 *
 * ActivateCompletePage
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import Layout from 'components/Layout';
import Button from 'components/Button';
import IcoFont from 'react-icofont';

import { withTheme } from 'styled-components';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import Title from 'components/Title';
import LoadingIndicator from 'components/LoadingIndicator';
import makeSelectActivateCompletePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { forwardTo } from '../../helpers/forwardTo';
import PATH from '../path';
import { submitConfirmChange } from './actions';

export function ActivateCompletePage(props) {
  useInjectReducer({ key: 'activateCompletePage', reducer });
  useInjectSaga({ key: 'activateCompletePage', saga });

  useEffect(() => {
    if (props.changeEmail) {
      setLoading(true);
      const resetCode = props.querystring.get('reset_code');
      props.onChangeEmailSubmit(resetCode, onChangeEmailSubmitted);
    } else if (props.sentChangeEmail) {
      getResultData(3);
    } else if (props.sentChangePassword) {
      getResultData(4);
    }
  }, []);

  const onChangeEmailSubmitted = status => {
    getResultData(status ? 1 : 2);
    setLoading(false);
  };

  const { intl } = props;
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [title, setTitle] = useState(
    intl.formatMessage({ ...messages.PasswordChangeSuccess }),
  );
  const [message, setMessage] = useState(
    intl.formatMessage({ ...messages.EmailChangeSuccess }),
  );
  const [icon, setIcon] = useState('icofont-check-circled');
  const [path, setPath] = useState(PATH.LOGIN);

  useEffect(() => {
    if (!loading) {
      setShowContent(true);
    }
  }, [loading]);

  const getResultData = (status = 1) => {
    // New Change Email Success
    if (status === 1) {
      setTitle(intl.formatMessage({ ...messages.EmailActivationTitle }));
      setMessage(intl.formatMessage({ ...messages.EmailChangeSuccess }));
      setIcon('icofont-check-circled');
      setPath(PATH.LOGIN);
    }
    // New Change Email Failed
    else if (status === 2) {
      setTitle(intl.formatMessage({ ...messages.LinkExpiredTitle }));
      setMessage(intl.formatMessage({ ...messages.ResetLinkExpired }));
      setIcon('icofont-check-circled');
      setPath(PATH.LOGIN);
    }
    // Initialize of Change Email
    else if (status === 3) {
      setTitle(intl.formatMessage({ ...messages.EmailActivationTitle }));
      setMessage(intl.formatMessage({ ...messages.EmailSent }));
      setIcon('icofont-check-circled');
      setPath(PATH.LOGIN);
      setLoading(false);
    }
    // Initialize of Change Email
    else if (status === 4) {
      setTitle(intl.formatMessage({ ...messages.PasswordChangeTitle }));
      setMessage('');
      setIcon('icofont-check-circled');
      setPath(PATH.LOGIN);
      setLoading(false);
    }
  };

  return (
    <Layout isFullPage>
      <Helmet>
        <title>{intl.formatMessage({ ...messages.activateComplete })}</title>
        <meta
          name="description"
          content="Description of ActivateCompletePage"
        />
      </Helmet>
      <div className="text-center col-lg-5 mx-auto">
        {loading && <LoadingIndicator />}
        {showContent && (
          <>
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
                <Button onClick={() => forwardTo(path)}>
                  {intl.formatMessage({ ...messages.login })}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

ActivateCompletePage.propTypes = {
  // match: PropTypes.any,
  changeEmail: PropTypes.bool,
  sentChangeEmail: PropTypes.bool,
  sentChangePassword: PropTypes.bool,
  onChangeEmailSubmit: PropTypes.func,
  querystring: PropTypes.object,
  intl: PropTypes.any,
};

ActivateCompletePage.defaultProps = {
  changeEmail: false,
  sentChangeEmail: false,
  sentChangePassword: false,
};

const mapStateToProps = createStructuredSelector({
  activateCompletePage: makeSelectActivateCompletePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onChangeEmailSubmit: (changeEmailCode, onSubmitted) => {
      dispatch(submitConfirmChange({ changeEmailCode }, onSubmitted));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
  injectIntl,
  withTheme,
)(ActivateCompletePage);
