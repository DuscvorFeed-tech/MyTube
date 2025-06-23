/**
 *
 * ForgotPasswordPage
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  Form,
  Header,
  Button,
  Grid,
  Segment,
  Input,
  Label,
} from 'semantic-ui-react';
import './ForgotPasswordPage.scss';
import 'semantic-ui-css/semantic.min.css';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import ErrorFormatted from '../../components/ErrorFormatted';
import makeSelectForgotPasswordPage, { makeSelectError } from './selectors';
import reducer from './reducer';
import saga from './saga';
import validation from './validators';
import { submitForgotPassword } from './actions';
import useValidation, { isValid } from '../../library/validator';
import useSubmitEffect from '../../library/submitter';
import messages from './messages';
import ForgotSuccessModal from './subcomponents/ForgotSuccess';

export function ForgotPasswordPage({ intl, onSubmit, errors }) {
  useInjectReducer({ key: 'forgotPasswordPage', reducer });
  useInjectSaga({ key: 'forgotPasswordPage', saga });

  const validator = validation(intl);
  const email = useValidation('', validator.email);
  const invalid = !isValid([email]);
  const submitter = useSubmitEffect([onSubmit, [email.value, intl.locale]]);

  return (
    <div className="page-content">
      <Grid className="grid">
        <Grid.Column className="grid-column">
          <Segment>
            <Header as="h2" className="header">
              {intl.formatMessage({ ...messages.forgotPassword })}
            </Header>
            <Form className="form">
              <Form.Field>
                <Input
                  placeholder={intl.formatMessage({ ...messages.email })}
                  name="email"
                  type="text"
                  {...email}
                  onKeyDown={submitter.onPressedEnter}
                />
                {errors && errors.Email && (
                  <Label pointing>
                    <ErrorFormatted errors={errors} name="Email" />
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
                {intl.formatMessage({ ...messages.btn_submit })}
              </Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>

      <ForgotSuccessModal />
    </div>
  );
}

ForgotPasswordPage.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: PropTypes.func,
  errors: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  forgotPasswordPage: makeSelectForgotPasswordPage(),
  errors: makeSelectError(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (values, onSubmitted) => {
      const [email, locale] = values;
      dispatch(submitForgotPassword({ email, locale }, onSubmitted));
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
)(ForgotPasswordPage);
