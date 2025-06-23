/* eslint-disable prettier/prettier */
/**
 *
 * LoginPage
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
// import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { forwardTo } from 'helpers/forwardTo';
import logo from 'assets/images/common/logo.svg';
import './LoginContent/LoginContent.scss';
import {
  Form,
  Header,
  Button,
  Grid,
  Segment,
  Message,
  Label,
  Input,
} from 'semantic-ui-react';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import ErrorFormatted from '../../components/ErrorFormatted';
import makeSelectLoginPage, { makeSelectErrors } from './selectors';
import reducer from './reducer';
import saga from './saga';
import validation from './validators';
import { submitLogin } from './actions';
import useValidation, { isValid } from '../../library/validator';
import useSubmitEffect from '../../library/submitter';
// import { forwardTo } from '../../helpers/forwardTo';
// import PATH from '../path';
import 'semantic-ui-css/semantic.min.css';
import messages from './messages';

export function LoginPage({ intl, onSubmit, errors }) {
  useInjectReducer({ key: 'loginPage', reducer });
  useInjectSaga({ key: 'loginPage', saga });

  const validator = validation(intl);
  const emailUsername = useValidation('', validator.emailUsername);
  const password = useValidation('', validator.password);
  const invalid = !isValid([emailUsername, password]);
  const submitter = useSubmitEffect(
    [onSubmit, [emailUsername.value, password.value]],
    () => !invalid,
  );

  return (
    <div className="page-content">
      <Grid className="grid">
        <Grid.Column className="grid-column">
          <Segment className="login-box">
            <ErrorFormatted errors={errors} name="EmailUsernamePassword" />
            <Header as="h2" className="header">
              <a href="/">
                <img className="logo" src={logo} alt="logo" />
              </a>
            </Header>
            <h3>Sign-in</h3>
            <Form className="form">
              <Form.Field>
                <Input
                  placeholder={intl.formatMessage({ ...messages.emailUsername })}
                  type="text"
                  name="emailUsername"
                  {...emailUsername}
                  onKeyDown={submitter.onPressedEnter}
                />
                {errors && errors.Email && (
                  <Label pointing>
                    <ErrorFormatted errors={errors} name="Email" />
                  </Label>
                )}
              </Form.Field>
              
              <Form.Field>
                <Input
                  placeholder={intl.formatMessage({ ...messages.password })}
                  name="password"
                  type="password"
                  {...password}
                  onKeyDown={submitter.onPressedEnter}
                />
                {errors && errors.Password && (
                  <Label pointing>
                    <ErrorFormatted errors={errors} name="Password" />
                  </Label>
                )}
              </Form.Field>
              <Button
               
                className="login-button"
                fluid
                size="large"
                type="submit"
                disabled={invalid || submitter.submitting}
                {...submitter}
              >
                {intl.formatMessage({ ...messages.login })}
              </Button>
              <Message>
                <Label as="a" onClick={()=>forwardTo("/register")}>
                    {intl.formatMessage({ ...messages.registerHere })}
                  </Label><br/>
                  <Label as="a" onClick={()=>forwardTo("/forgotpassword")}>
                    {' '}
                    {intl.formatMessage({ ...messages.forgotPassword })}
                  </Label>
              </Message>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    </div>
  );
}

LoginPage.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: PropTypes.func,
  errors: PropTypes.any,
  querystring: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  loginPage: makeSelectLoginPage(),
  errors: makeSelectErrors(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (values, onSubmitted) => {
      const [emailUsername, password] = values;
      dispatch(submitLogin({ emailUsername, password }, onSubmitted));
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
)(LoginPage);
