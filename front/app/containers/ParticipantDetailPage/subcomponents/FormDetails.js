/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';

import Form from 'components/Form';
import Button from 'components/Button';
import ErrorFormatted from 'components/ErrorFormatted';
import messages from '../messages';
import PersonalInformation from './PersonalInformation';
import ThankfulPerson1 from './ThankfulPerson1';
import ThankfulPerson2 from './ThankfulPerson2';

function FormDetails(props) {
  const {
    intl,
    participantDetailPage: { partDetails, error, isEdit, campDetails },
    commonTypes: { EntryStatus },
    validatorEffect: {
      payload,
      setInvalidPersonalInformation,
      setInvalidThankfulPerson1,
      setInvalidThankfulPerson2,
    },
  } = props;
  const { form_fields_schema } = campDetails || {};
  const form_input = {};
  if (partDetails && partDetails.form_input) {
    partDetails.form_input.split('|').map(input => {
      const [key, value] = input.split(':');
      form_input[key] = value;
      return true;
    });
  }

  const form_fields1 =
    campDetails && campDetails.form_fields
      ? campDetails.form_fields.filter(f => f < 20).map(f => f % 10)
      : [];
  const form_fields2 =
    campDetails && campDetails.form_fields
      ? campDetails.form_fields.filter(f => f > 20 && f < 30).map(f => f % 20)
      : [];
  const form_fields3 =
    campDetails && campDetails.form_fields
      ? campDetails.form_fields.filter(f => f > 30).map(f => f % 30)
      : [];
  payload.form_input = form_input;
  const form_fields_required = (form_fields_schema || [])
    .filter(f => f.required)
    .map(f => f.form_id);

  const isWinner = EntryStatus.find(f => f.value === partDetails.entry_status);
  const showThankful = campDetails.form_design === 2;
  const { form_design } = campDetails;

  return (
    <div className="border-bottom py-4">
      {error && <ErrorFormatted invalid list={[error]} />}
      {campDetails && partDetails && (
        <Form className="col-9 mx-auto">
          <div className="col-12">
            <div className="row">
              <div className="col-4 content">
                {intl.formatMessage({ ...messages.dateSubmitted })}
              </div>
              <div className="col-8 content">
                {partDetails.form_submission_date}
              </div>
            </div>
            <div className="row">
              <div className="col-4 content">Date of Latest Update</div>
              <div className="col-8 content">
                {partDetails.form_latest_update}
              </div>
            </div>
            <div className="title">
              {intl.formatMessage({ ...messages.submittedDetails })}
            </div>

            <div>
              {isWinner && isWinner.value === 1 && !isEdit && (
                <div className="row">
                  <div className="col-4 content">
                    {intl.formatMessage({ ...messages.couponLink })}
                  </div>
                  <div className="col-8 label">
                    <Button
                      className="col-12 text-truncate"
                      link
                      onClick={() => {
                        if (partDetails.claim_coupon_link) {
                          window.open(partDetails.claim_coupon_link, '_blank');
                        }
                      }}
                    >
                      {partDetails.claim_coupon_link}
                    </Button>
                  </div>
                </div>
              )}

              {form_fields1 && form_fields1.length > 0 && (
                <PersonalInformation
                  isConfirmStep={!isEdit}
                  inputFormFields={form_fields1}
                  formFieldsRequired={form_fields_required
                    .filter(f => f < 20)
                    .map(f => f % 10)}
                  payload={payload.form_input}
                  intl={intl}
                  setInvalidPersonalInformation={setInvalidPersonalInformation}
                  formDesign={form_design}
                />
              )}
              {showThankful && form_fields2 && form_fields2.length > 0 && (
                <ThankfulPerson1
                  isConfirmStep={!isEdit}
                  inputFormFields={form_fields2}
                  formFieldsRequired={form_fields_required
                    .filter(f => f >= 20 && f < 30)
                    .map(f => f % 10)}
                  payload={payload.form_input}
                  intl={intl}
                  setInvalidThankfulPerson1={setInvalidThankfulPerson1}
                />
              )}
              {showThankful && form_fields3 && form_fields3.length > 0 && (
                <ThankfulPerson2
                  isConfirmStep={!isEdit}
                  inputFormFields={form_fields3}
                  formFieldsRequired={form_fields_required
                    .filter(f => f >= 30)
                    .map(f => f % 10)}
                  payload={payload.form_input}
                  intl={intl}
                  setInvalidThankfulPerson2={setInvalidThankfulPerson2}
                />
              )}
            </div>
          </div>
        </Form>
      )}
    </div>
  );
}

FormDetails.propTypes = {
  participantDetailPage: PropTypes.any,
  commonTypes: PropTypes.object,
  intl: PropTypes.any,
  validatorEffect: PropTypes.any,
};

export default FormDetails;
