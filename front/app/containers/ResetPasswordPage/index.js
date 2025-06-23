/**
 *
 * ResetPasswordPage
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import { withTheme } from 'styled-components';

import Layout from 'components/Layout';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import LoadingIndicator from '../../components/LoadingIndicator';
import Title from '../../components/Title';
import Label from '../../components/Label';
import Input from '../../components/Input';
import Button from '../../components/Button';
import useValidation, { isValid } from '../../library/validator';
import validation from './validators';
import useSubmitEffect from '../../library/submitter';

import makeSelectResetPasswordPage, {
  makeSelectLoading,
  makeSelectErrors,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import { validateCode, submitPassword, setLoading } from './actions';
import ErrorFormatted from '../../components/ErrorFormatted';
import AdminLocal from '../../utils/AdminLocal';
import messages from './messages';
import { forwardTo } from '../../helpers/forwardTo';

export function ResetPasswordPage({
  intl,
  onValidateCode,
  querystring,
  loading,
  onSubmit,
  errors,
  theme,
}) {
  useInjectReducer({ key: 'resetPasswordPage', reducer });
  useInjectSaga({ key: 'resetPasswordPage', saga });

  useEffect(() => {
    onValidateCode({ resetCode: querystring.get('reset_code') });
  });

  const validator = validation(intl);
  const password = useValidation('', validator.password);
  const confirmPassword = useValidation(
    '',
    validator.confirmPassword(password.value),
  );

  useEffect(() => {
    if (password.error.touched) {
      confirmPassword.onUseEffect();
    }
  }, [password.value]);
  const invalid = !isValid([password, confirmPassword]);

  const submitter = useSubmitEffect([
    onSubmit,
    [password.value, confirmPassword.value, querystring.get('reset_code')],
  ]);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      <Layout isFullPage>
        <Helmet>
          <title>{intl.formatMessage({ ...messages.resetPassword })}</title>
          <meta
            name="description"
            content="Description of Reset Password Page"
          />
        </Helmet>
        <div className="text-center col-lg-5 mx-auto">
          <Title main color={theme.secondaryDark} className="text-center">
            {intl.formatMessage({ ...messages.resetPassword })}
          </Title>
          <div className="pt-5">
            <div className="row align-items-baseline pb-3">
              <div className="col-md-4 text-left">
                <Label>{intl.formatMessage({ ...messages.newPassword })}</Label>
              </div>
              <div className="col-md-8 text-left">
                <Input name="newPassword" type="password" {...password} />
                <ErrorFormatted {...password.error} />
              </div>
            </div>
            <div className="row align-items-baseline">
              <div className="col-md-4 text-left">
                <Label>
                  {intl.formatMessage({ ...messages.confirmPassword })}
                </Label>
              </div>
              <div className="col-md-8 text-left">
                <Input
                  name="confirmPassword"
                  type="password"
                  {...confirmPassword}
                />
                <ErrorFormatted {...confirmPassword.error} />
              </div>
            </div>
          </div>
          {errors && (
            <div className="row align-items-baseline">
              <div className="col-md-4 text-left" />
              <div className="col-md-8 text-left">
                {errors && <ErrorFormatted invalid list={[errors]} />}
              </div>
            </div>
          )}
          <div className="row mt-5">
            <div className="col-md-5 mx-auto mb-3">
              <Button secondary onClick={() => forwardTo('/login')}>
                {intl.formatMessage({ ...messages.cancel })}
              </Button>
            </div>
            <div className="col-md-5 mx-auto mb-3">
              <Button
                type="submit"
                disabled={invalid || submitter.submitting}
                {...submitter}
              >
                {intl.formatMessage({ ...messages.save })}
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

ResetPasswordPage.propTypes = {
  onValidateCode: PropTypes.func,
  querystring: PropTypes.object,
  loading: PropTypes.bool,
  intl: PropTypes.any,
  onSubmit: PropTypes.func,
  errors: PropTypes.any,
  theme: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  resetPasswordPage: makeSelectResetPasswordPage(),
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
});

function mapDispatchToProps(dispatch) {
  return {
    onValidateCode: payload => {
      const firstLogin = AdminLocal.isForResetPassword();
      if (!firstLogin) {
        dispatch(validateCode(payload));
      } else {
        dispatch(setLoading(false));
      }
    },
    onSubmit: (values, onSubmitted) => {
      const [newPassword, confirmPassword, resetCode] = values;
      dispatch(
        submitPassword(
          { newPassword, confirmPassword, resetCode },
          onSubmitted,
        ),
      );
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
)(ResetPasswordPage);
