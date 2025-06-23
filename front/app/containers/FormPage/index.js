/* eslint-disable camelcase */
/**
 *
 * FormPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { injectIntl, intlShape } from 'react-intl';
import { withTheme } from 'styled-components';

import Card from 'components/Card';
import Text from 'components/Text';
import Img from 'components/Img';
import Form from 'components/Form';
import Button from 'components/Button';
import ErrorFormatted from 'components/ErrorFormatted';
import Layout from 'components/Layout';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import useSubmitEffect from '../../library/submitter';
import makeSelectFormPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getForm, submitForm, setSuccess } from './actions';
import messages from './messages';
import { config } from '../../utils/config';
import Title from '../../components/Title';
// import DefaultPersonalInformation from './subcomponents/DefaultPersonalInformation';
import PersonalInformation from './subcomponents/PersonalInformation';
import ThankfulPerson1 from './subcomponents/ThankfulPerson1';
import ThankfulPerson2 from './subcomponents/ThankfulPerson2';

export function FormPage(props) {
  useInjectReducer({ key: 'formPage', reducer });
  useInjectSaga({ key: 'formPage', saga });
  const [isConfirmStep, setConfirmStep] = useState(false);

  const {
    formPage: { form, error, success },
    intl,
  } = props;

  const { form_fields_schema } = form || {};

  useEffect(() => {
    props.onGetForm(props.routeParams.coupon);
  }, []);

  const form_fields1 =
    form && form.form_fields
      ? form.form_fields.filter(f => f < 20).map(f => f % 10)
      : [];
  const form_fields2 =
    form && form.form_fields
      ? form.form_fields.filter(f => f > 20 && f < 30).map(f => f % 20)
      : [];
  const form_fields3 =
    form && form.form_fields
      ? form.form_fields.filter(f => f > 30).map(f => f % 30)
      : [];
  const form_design = form && form.form_design ? form.form_design : 1;
  const show_thankful_1 =
    form_fields2 && form_fields2.length > 0 && form_design === 2;
  const show_thankful_2 =
    form_fields3 && form_fields3.length > 0 && form_design === 2;

  const form_fields_required = (form_fields_schema || [])
    .filter(f => f.required)
    .map(f => f.form_id);

  useEffect(() => {
    if (success) {
      props.onSetSuccess(false);
    }
  }, [success]);

  const payload = {};
  payload.coupon = props.routeParams.coupon;
  const [invalidDefault] = useState(false);
  const [invalidPersonalInformation, setInvalidPersonalInformation] = useState(
    false,
  );
  const [invalidThankfulPerson1, setInvalidThankfulPerson1] = useState(false);
  const [invalidThankfulPerson2, setInvalidThankfulPerson2] = useState(false);
  const submitter = useSubmitEffect(
    [props.onSubmit, payload],
    () =>
      !invalidDefault &&
      !invalidPersonalInformation &&
      !invalidThankfulPerson1 &&
      !invalidThankfulPerson2,
  );

  return (
    <div>
      <Helmet>
        <title>{intl.formatMessage({ ...messages.form })}</title>
        <meta name="description" content="Description of Form Page" />
      </Helmet>
      {form && form.winner_email ? (
        <Layout isFullPage>
          <div className="text-center col-lg-5 mx-auto">
            <Title main className="text-center text-uppercase text-danger">
              {intl.formatMessage({ ...messages.alreadyTaken })}
            </Title>
            <h5 className="mt-4 mb-5">
              {intl.formatMessage({ ...messages.contactAdmin })}
            </h5>
          </div>
        </Layout>
      ) : (
        <Form className="text-center col-lg-5 mx-auto">
          <Card>
            {error && <ErrorFormatted invalid list={[error]} />}
            {form && (
              <>
                {form.header_file && (
                  <div className="col-12 mx-auto">
                    <Img
                      src={`${config.API_URL}/form-image?filename=${
                        form.header_file
                      }`}
                      alt="logo"
                    />
                  </div>
                )}
                <div
                  className="col-12 title text-left pt-3 pb-1"
                  style={{ textTransform: 'none' }}
                >
                  {form.title}
                </div>
                <hr className="pb-1" />
                <div
                  className="col-12 text-left pb-4"
                  style={{ whiteSpace: 'pre-line' }}
                >
                  <p>
                    {form.description} <br />
                    {form.content}
                  </p>
                </div>
                {isConfirmStep && (
                  <h5 className="text-left p-2">
                    {intl.formatMessage({ ...messages.confirmation })}
                  </h5>
                )}

                {/* <DefaultPersonalInformation
                  isConfirmStep={isConfirmStep}
                  inputFormFields={form_fields1}
                  payload={payload}
                  intl={intl}
                  setInvalidDefault={setInvalidDefault}
                ></DefaultPersonalInformation> */}

                {form_fields1 && form_fields1.length > 0 && (
                  <PersonalInformation
                    isConfirmStep={isConfirmStep}
                    inputFormFields={form_fields1}
                    formFieldsRequired={form_fields_required
                      .filter(f => f < 20)
                      .map(f => f % 10)}
                    payload={payload}
                    intl={intl}
                    formDesign={form_design}
                    setInvalidPersonalInformation={
                      setInvalidPersonalInformation
                    }
                  />
                )}
                {show_thankful_1 && (
                  <ThankfulPerson1
                    isConfirmStep={isConfirmStep}
                    inputFormFields={form_fields2}
                    formFieldsRequired={form_fields_required
                      .filter(f => f >= 20 && f < 30)
                      .map(f => f % 10)}
                    payload={payload}
                    intl={intl}
                    setInvalidThankfulPerson1={setInvalidThankfulPerson1}
                  />
                )}
                {show_thankful_2 && (
                  <ThankfulPerson2
                    isConfirmStep={isConfirmStep}
                    inputFormFields={form_fields3}
                    formFieldsRequired={form_fields_required
                      .filter(f => f >= 30)
                      .map(f => f % 10)}
                    payload={payload}
                    intl={intl}
                    setInvalidThankfulPerson2={setInvalidThankfulPerson2}
                  />
                )}

                {isConfirmStep ? (
                  <div>
                    <Button
                      type="submit"
                      disabled={
                        invalidDefault ||
                        invalidPersonalInformation ||
                        invalidThankfulPerson1 ||
                        invalidThankfulPerson2 ||
                        submitter.submitting
                      }
                      {...submitter}
                    >
                      {intl.formatMessage({ ...messages.submit })}
                    </Button>
                    <Button
                      className="w-100 mt-3"
                      link
                      onClick={() => setConfirmStep(false)}
                    >
                      {intl.formatMessage({ ...messages.back })}
                    </Button>
                  </div>
                ) : (
                  <Button
                    disabled={
                      invalidDefault ||
                      invalidPersonalInformation ||
                      invalidThankfulPerson1 ||
                      invalidThankfulPerson2
                    }
                    onClick={() => setConfirmStep(true)}
                  >
                    {intl.formatMessage({ ...messages.confirm })}
                  </Button>
                )}
                <hr className="mt-5" />
                <div style={{ whiteSpace: 'pre-line' }}>
                  <Text
                    className="col-12 title text-left"
                    noTextTransform
                    text={form.footer}
                  />
                </div>
              </>
            )}
          </Card>
        </Form>
      )}
    </div>
  );
}

FormPage.propTypes = {
  formPage: PropTypes.any,
  intl: intlShape.isRequired,
  routeParams: PropTypes.any,
  onGetForm: PropTypes.any,
  onSubmit: PropTypes.any,
  onSetSuccess: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  formPage: makeSelectFormPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetForm: coupon => dispatch(getForm(coupon)),
    onSetSuccess: data => dispatch(setSuccess(data)),
    onSubmit: data => dispatch(submitForm(data)),
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
)(FormPage);
