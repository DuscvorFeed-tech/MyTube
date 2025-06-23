/**
 *
 * ChangePasswordPage
 *
 */

import React, { memo } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withTheme } from 'styled-components';

import Layout from 'components/Layout';

import Title from 'components/Title';
import Label from 'components/Label';
import Input from 'components/Input';
import Button from 'components/Button';
import Text from 'components/Text';
// import ErrorFormatted from 'components/ErrorFormatted';
import useSubmitEffect from 'library/submitter';
import useValidation, { isValid } from 'library/validator';
import ErrorFormatted from 'components/ErrorFormatted';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { forwardTo } from 'helpers/forwardTo';
import makeSelectChangePasswordPage, { makeSelectErrors } from './selectors';
import reducer from './reducer';
import saga from './saga';
import validation from './validators';
import { submitChangePassword } from './actions';
import messages from './messages';

export function ChangePasswordPage(props) {
  useInjectReducer({ key: 'changePasswordPage', reducer });
  useInjectSaga({ key: 'changePasswordPage', saga });

  const validator = validation(props.intl);
  const currentPassword = useValidation('', validator.currentPassword);
  const newPassword = useValidation('', validator.newPassword);
  const confirmNewPassword = useValidation('', validator.confirmNewPassword);
  const invalid = !isValid([currentPassword, newPassword, confirmNewPassword]);

  const submitter = useSubmitEffect(
    [
      props.onSubmit,
      [currentPassword.value, newPassword.value, confirmNewPassword.value],
    ],
    () => !invalid,
  );

  return (
    <div>
      <Layout isFullPage>
        <Helmet>
          <title>
            {props.intl.formatMessage({ ...messages.changePassword })}
          </title>
          <meta
            name="description"
            content="Description of ChangePasswordPage"
          />
        </Helmet>
        <div className="text-center col-lg-5 mx-auto">
          <Title main color={props.theme.secondaryDark} className="text-center">
            {props.intl.formatMessage({ ...messages.changePassword })}
          </Title>
          <div className="pt-5">
            <div className="row align-items-baseline pb-3">
              <div className="col-md-4 text-left">
                <Label required>
                  {props.intl.formatMessage({ ...messages.currentPassword })}
                </Label>
              </div>
              <div className="col-md-8 text-left">
                <Input name="current" {...currentPassword} type="password" />
                <ErrorFormatted {...currentPassword.error} />
                {props.errors && (
                  <ErrorFormatted
                    invalid
                    list={props.errors.list}
                    names={['currentPassword']}
                  />
                )}
              </div>
            </div>
            <div className="row align-items-baseline pb-3">
              <div className="col-md-4 text-left">
                <Label required>
                  {props.intl.formatMessage({ ...messages.newPassword })}
                </Label>
              </div>
              <div className="col-md-8 text-left">
                <Input name="password" type="password" {...newPassword} />
                <ErrorFormatted {...newPassword.error} />
                {props.errors && (
                  <ErrorFormatted
                    invalid
                    list={props.errors.list}
                    names={['newPassword']}
                  />
                )}
              </div>
            </div>
            <div className="row align-items-baseline pb-3">
              <div className="col-md-4 text-left">
                <Label required>
                  {props.intl.formatMessage({ ...messages.confirmNewPassword })}
                </Label>
              </div>
              <div className="col-md-8 text-left">
                <Input
                  name="password"
                  type="password"
                  {...confirmNewPassword}
                />
                <ErrorFormatted {...confirmNewPassword.error} />
                {props.errors && (
                  <ErrorFormatted
                    invalid
                    list={props.errors.list}
                    names={['confirmPassword']}
                  />
                )}
              </div>
            </div>
          </div>
          {/* <div className="row align-items-baseline">
            <div className="col-md-4 text-left" />
            <div className="col-md-8 text-left">
              {props.errors && (
                <ErrorFormatted invalid list={props.errors.list} />
              )}
            </div>
          </div> */}
          <div className="row mt-5">
            <div className="col-auto mx-auto mb-3">
              <Button
                secondary
                width="md"
                onClick={() => forwardTo('/profile')}
              >
                {props.intl.formatMessage({ ...messages.btn_cancel })}
              </Button>
            </div>
            <div className="col-auto mx-auto mb-3">
              <Button
                width="md"
                type="submit"
                {...submitter}
                disabled={invalid || submitter.submitting}
              >
                {props.intl.formatMessage({ ...messages.btn_save })}
              </Button>
            </div>
          </div>
          <div className="mt-5">
            <Text text="Copyright © TCMS All rights reserved." />
          </div>
        </div>
      </Layout>
    </div>
  );
}

ChangePasswordPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  theme: PropTypes.any,
  intl: intlShape.isRequired,
  onSubmit: PropTypes.func,
  errors: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  changePasswordPage: makeSelectChangePasswordPage(),
  errors: makeSelectErrors(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (values, onSubmitted) => {
      const [currentPassword, newPassword, confirmPassword] = values;
      dispatch(
        submitChangePassword(
          { currentPassword, newPassword, confirmPassword },
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
  withTheme,
  injectIntl,
)(ChangePasswordPage);
