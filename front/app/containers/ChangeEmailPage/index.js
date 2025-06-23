/**
 *
 * ChangeEmailPage
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { injectIntl, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withTheme } from 'styled-components';

import Layout from 'components/Layout';

import Title from 'components/Title';
import Label from 'components/Label';
import Input from 'components/Input';
import Button from 'components/Button';
import Text from 'components/Text';
import ErrorFormatted from 'components/ErrorFormatted';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { forwardTo } from 'helpers/forwardTo';
import useSubmitEffect from 'library/submitter';
import useValidation, { isValid } from 'library/validator';
import makeSelectChangeEmailPage, { makeSelectErrors } from './selectors';
import reducer from './reducer';
import saga from './saga';
import validation from './validators';
import { submitChangeLogin } from './actions';
import messages from './messages';

export function ChangeEmailPage(props) {
  useInjectReducer({ key: 'changeEmailPage', reducer });
  useInjectSaga({ key: 'changeEmailPage', saga });

  const validator = validation(props.intl);
  const password = useValidation('', validator.password);
  const newEmail = useValidation('', validator.newEmail);
  const confirmEmail = useValidation('', validator.confirmEmail);
  const invalid = !isValid([password, newEmail, confirmEmail]);

  const submitter = useSubmitEffect(
    [props.onSubmit, [password.value, newEmail.value, confirmEmail.value]],
    () => !invalid,
  );

  return (
    <div>
      <Layout isFullPage>
        <Helmet>
          <title>{props.intl.formatMessage({ ...messages.changeEmail })}</title>
          <meta name="description" content="Description of ChangeEmailPage" />
        </Helmet>
        {/* <FormattedMessage {...messages.header} /> */}
        <div className="text-center col-lg-5 mx-auto">
          <Title main color={props.theme.secondaryDark} className="text-center">
            {props.intl.formatMessage({ ...messages.changeEmail })}
          </Title>
          <div className="pt-5">
            <div className="row align-items-baseline pb-3">
              <div className="col-md-4 text-left">
                <Label required>
                  {props.intl.formatMessage({ ...messages.currentPassword })}
                </Label>
              </div>
              <div className="col-md-8 text-left">
                <Input name="password" {...password} type="password" />
                <ErrorFormatted {...password.error} />
              </div>
            </div>
            <div className="row align-items-baseline pb-3">
              <div className="col-md-4 text-left">
                <Label required>
                  {props.intl.formatMessage({ ...messages.newEmail })}
                </Label>
              </div>
              <div className="col-md-8 text-left">
                <Input name="newEmail" {...newEmail} />
                <ErrorFormatted {...newEmail.error} />
              </div>
            </div>
            <div className="row align-items-baseline pb-3">
              <div className="col-md-4 text-left">
                <Label required>
                  {props.intl.formatMessage({ ...messages.confirmEmail })}
                </Label>
              </div>
              <div className="col-md-8 text-left">
                <Input name="confirmEmail" {...confirmEmail} />
                <ErrorFormatted {...confirmEmail.error} />
              </div>
            </div>
          </div>
          <div className="row align-items-baseline">
            <div className="col-md-4 text-left" />
            <div className="col-md-8 text-left">
              {props.errors && (
                <ErrorFormatted invalid list={props.errors.list} />
              )}
            </div>
          </div>
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

ChangeEmailPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  theme: PropTypes.any,
  intl: intlShape.isRequired,
  onSubmit: PropTypes.func,
  errors: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  changeEmailPage: makeSelectChangeEmailPage(),
  errors: makeSelectErrors(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (values, onSubmitted) => {
      const [password, newEmail, confirmEmail] = values;
      dispatch(
        submitChangeLogin({ newEmail, confirmEmail, password }, onSubmitted),
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
)(ChangeEmailPage);
