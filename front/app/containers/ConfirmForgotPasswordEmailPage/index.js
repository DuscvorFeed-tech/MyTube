import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from 'components/LoadingIndicator';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { compose } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { createStructuredSelector } from 'reselect';
import makeSelectConfirmForgotPasswordEmailPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { confirmKeyAndConfirmationCode } from './actions';

export function ConfirmForgotPasswordEmailPage(props) {
  useInjectReducer({ key: 'confirmForgotPasswordEmailPage', reducer });
  useInjectSaga({ key: 'confirmForgotPasswordEmailPage', saga });

  const {
    routeParams: { key, confirmcode },
  } = props;

  useEffect(() => {
    props.onConfirm(key, confirmcode);
  }, []);

  return <LoadingIndicator />;
}

ConfirmForgotPasswordEmailPage.propTypes = {
  onConfirm: PropTypes.func,
  routeParams: PropTypes.any,
};

function mapDispatchToProps(dispatch) {
  return {
    onConfirm: (key, confirmcode) => {
      dispatch(confirmKeyAndConfirmationCode({ key, confirmcode }));
    },
  };
}

const mapStateToProps = createStructuredSelector({
  confirmForgotPasswordEmailPage: makeSelectConfirmForgotPasswordEmailPage(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  injectIntl,
)(ConfirmForgotPasswordEmailPage);
