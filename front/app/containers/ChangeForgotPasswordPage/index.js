import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import {
  Form,
  Header,
  Button,
  Grid,
  Segment,
  Label,
  Input,
} from 'semantic-ui-react';
import ErrorFormatted from '../../components/ErrorFormatted';
import makeSelectChangeForgotPasswordPage, {
  makeSelectErrors,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import validation from './validators';
import { submitChange } from './actions';
import useValidation, { isValid } from '../../library/validator';
import useSubmitEffect from '../../library/submitter';
import 'semantic-ui-css/semantic.min.css';
import './ChangeForgotPasswordPageContent/ChangeForgotPasswordPageContent.scss';
import messages from './messages';
import ChangeForgotPasswordSuccessModal from './subcomponents/ChangeForgotPasswordSuccess';

export function ChangeForgotPasswordPage(props) {
  useInjectReducer({ key: 'changeForgotPasswordPage', reducer });
  useInjectSaga({ key: 'changeForgotPasswordPage', saga });

  const {
    intl,
    onSubmit,
    errors,
    routeParams: { key, resetcode },
  } = props;

  const validator = validation(intl);
  const password = useValidation('', validator.password);
  const confirmPassword = useValidation('', validator.confirmPassword);
  const invalid = !isValid([password, confirmPassword]);
  const submitter = useSubmitEffect(
    [onSubmit, [password.value, confirmPassword.value, key, resetcode]],
    () => !invalid,
  );

  return (
    <div className="page-content">
      <Grid className="grid">
        <Grid.Column className="grid-column">
          <Segment>
            <ErrorFormatted errors={errors} name="Key|ResetCode" />
            <Header as="h3" className="header">
              {intl.formatMessage({ ...messages.changeForgotPassword })}
            </Header>
            <Form className="form">
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
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>

      <ChangeForgotPasswordSuccessModal />
    </div>
  );
}

ChangeForgotPasswordPage.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: PropTypes.func,
  errors: PropTypes.any,
  routeParams: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  changeForgotPasswordPage: makeSelectChangeForgotPasswordPage(),
  errors: makeSelectErrors(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (values, onSubmitted) => {
      const [password, confirmPassword, key, resetcode] = values;
      dispatch(
        submitChange(
          { password, confirmPassword, key, resetcode },
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
  injectIntl,
)(ChangeForgotPasswordPage);
