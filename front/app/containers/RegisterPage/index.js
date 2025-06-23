import React from 'react';
import PropTypes from 'prop-types';
// import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import Select from 'components/Select';
import {
  Form,
  Header,
  Button,
  Grid,
  Segment,
  Message,
  Label,
  Input,
  Checkbox,
} from 'semantic-ui-react';
import ErrorFormatted from '../../components/ErrorFormatted';
import makeSelectRegisterPage, {
  makeSelectErrors,
  makeSelectUserType,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import validation from './validators';
import { submitRegister, setUserType } from './actions';
import useValidation, { isValid } from '../../library/validator';
import useSubmitEffect from '../../library/submitter';
import 'semantic-ui-css/semantic.min.css';
import './RegistrationContent/RegistrationContent.scss';
import messages from './messages';
import UserForConfirmationModal from './subcomponents/UserForConfirmation';
import { forwardTo } from '../../helpers/forwardTo';

export function RegisterPage({
  intl,
  onSubmit,
  errors,
  setUserTypeId,
  userTypeId,
}) {
  useInjectReducer({ key: 'registerPage', reducer });
  useInjectSaga({ key: 'registerPage', saga });
  const validator = validation(intl);
  const username = useValidation('', validator.username);
  const email = useValidation('', validator.email);
  const password = useValidation('', validator.password);
  const confirmPassword = useValidation('', validator.confirmPassword);
  const agree = useValidation('', validator.agree);
  const securedFileTransfer = useValidation('', validator.securedFileTransfer);
  const selectedUserTypeId = useValidation('', validator.userType);
  const invalid = !isValid([email, password, confirmPassword, agree]);
  const submitter = useSubmitEffect(
    [
      onSubmit,
      [
        username.value,
        email.value,
        password.value,
        confirmPassword.value,
        selectedUserTypeId.value,
        agree.value,
        intl.locale,
        securedFileTransfer.value,
      ],
    ],
    () => !invalid,
  );

  return (
    <div className="page-content">
      <Grid className="grid">
        <Grid.Column className="grid-column">
          <Segment>
            <Header as="h2" className="header">
              {intl.formatMessage({ ...messages.register })}
            </Header>
            <Form className="form">
              <Form.Field>
                <Input
                  placeholder={intl.formatMessage({ ...messages.username })}
                  type="text"
                  name="username"
                  {...username}
                  onKeyDown={submitter.onPressedEnter}
                />
                {errors && errors.Username && (
                  <Label pointing>
                    <ErrorFormatted errors={errors} name="Username" />
                  </Label>
                )}
              </Form.Field>
              <Form.Field>
                <Input
                  placeholder={intl.formatMessage({ ...messages.email })}
                  type="text"
                  name="email"
                  {...email}
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
              <Form.Field>
                <Input
                  placeholder={intl.formatMessage({
                    ...messages.confirmPassword,
                  })}
                  name="confirmPassword"
                  type="password"
                  {...confirmPassword}
                  onKeyDown={submitter.onPressedEnter}
                />
                {errors && errors.ConfirmPassword && (
                  <Label pointing>
                    <ErrorFormatted errors={errors} name="ConfirmPassword" />
                  </Label>
                )}
              </Form.Field>
              <Form.Field>
                <Select
                  borderRadius
                  name="userType"
                  onChange={e => setUserTypeId(e)}
                  value={userTypeId}
                >
                  <option key="1" value="1">
                    {intl.formatMessage({ ...messages.basic })}
                  </option>
                  <option key="2" value="2">
                    {intl.formatMessage({ ...messages.creator })}
                  </option>
                </Select>
              </Form.Field>
              <Form.Field>
                <Checkbox
                  type="checkbox"
                  name="securedFileTransfer"
                  value="true"
                  id="securedFileTransfer"
                  {...securedFileTransfer}
                  label={intl.formatMessage({
                    ...messages.securedFileTransfer,
                  })}
                />
              </Form.Field>
              <Form.Field>
                <Checkbox
                  type="checkbox"
                  name="agree"
                  value="true"
                  id="agree"
                  {...agree}
                  label={intl.formatMessage({ ...messages.terms })}
                />
                <br />
                {errors && errors.Agree && (
                  <Label pointing>
                    <ErrorFormatted errors={errors} name="Agree" />
                  </Label>
                )}
              </Form.Field>
              <Button
                color="red"
                fluid
                size="large"
                type="submit"
                disabled={invalid || submitter.submitting}
                {...submitter}
              >
                {intl.formatMessage({ ...messages.submit })}
              </Button>
              <Message>
                <p>
                  {intl.formatMessage({ ...messages.hasAccount })}
                  <Label as="a" onClick={() => forwardTo('/login')}>
                    {' '}
                    {intl.formatMessage({ ...messages.loginhere })}
                  </Label>
                </p>
              </Message>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>

      <UserForConfirmationModal />
    </div>
  );
}

RegisterPage.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: PropTypes.func,
  errors: PropTypes.any,
  onSetData: PropTypes.any,
  userTypeId: PropTypes.number,
  setUserTypeId: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  registerPage: makeSelectRegisterPage(),
  errors: makeSelectErrors(),
  userTypeId: makeSelectUserType(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (values, onSubmitted) => {
      const [
        username,
        email,
        password,
        confirmPassword,
        userType,
        agree,
        locale,
        securedFileTransfer,
      ] = values;
      dispatch(
        submitRegister(
          {
            username,
            email,
            password,
            confirmPassword,
            userType,
            agree,
            locale,
            securedFileTransfer,
          },
          onSubmitted,
        ),
      );
    },
    setUserTypeId: e => {
      dispatch(setUserType(e.target.value));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  injectIntl,
)(RegisterPage);
