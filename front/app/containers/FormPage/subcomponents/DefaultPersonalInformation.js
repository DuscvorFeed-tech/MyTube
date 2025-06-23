/* eslint-disable camelcase */
/**
 *
 * FormPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Label from 'components/Label';
import Input from 'components/Input';
import ErrorFormatted from 'components/ErrorFormatted';
import messages from '../messages';
import useValidation, { isValid } from '../../../library/validator';
import validation from '../validators';

const DefaultPersonalInformation = props => {
  const {
    inputFormFields = [],
    isConfirmStep,
    payload,
    setInvalidDefault,
  } = props;

  const isEmail = inputFormFields.includes(Number(EnumFormFields.EMAIL));
  const isName = inputFormFields.includes(Number(EnumFormFields.NAME));
  const isTelNo = inputFormFields.includes(Number(EnumFormFields.TELNO));
  const isAddress = inputFormFields.includes(Number(EnumFormFields.ADDRESS));

  const validator = validation(props.intl);
  const email = useValidation('', validator.email(isEmail));
  const full_name = useValidation('', validator.full_name(isName));
  const contact_no = useValidation('', validator.contact_no(isTelNo));
  const zip_code = useValidation('', validator.zip_code(isAddress));
  const state = useValidation('', validator.state(isAddress));
  const city = useValidation('', validator.city(isAddress));
  const street = useValidation('', validator.street(isAddress));
  const building = useValidation('');

  let emailInvalid = false;
  let nameInvalid = false;
  let contactInvalid = false;

  if (isEmail) {
    emailInvalid = !isValid([email]);
    payload.email = email.value;
  }

  if (isName) {
    nameInvalid = !isValid([full_name]);
    payload.full_name = full_name.value;
  }

  if (isTelNo) {
    contactInvalid = !isValid([contact_no]);
    payload.contact_no = contact_no.value;
  }

  if (isAddress) {
    payload.zip_code = zip_code.value;
    payload.state = state.value;
    payload.city = city.value;
    payload.street = street.value;
    payload.building = building.value;
  }

  setInvalidDefault(emailInvalid || nameInvalid || contactInvalid);

  return (
    <>
      {inputFormFields.length > 0 && (
        <>
          <div
            className="col-12 title text-left pt-3 pb-1"
            style={{ textTransform: 'none' }}
          >
            <FormattedMessage {...messages.personalInformation} />
          </div>
          {isEmail && (
            <div className="row mb-2">
              <div className="pl-4 col-5 py-0 label text-left">
                <Label required>
                  <FormattedMessage {...messages.email} />
                </Label>
              </div>
              <div className="col-7 pr-4">
                {isConfirmStep ? (
                  <Input name="email" disabled {...email} />
                ) : (
                  <Input name="email" {...email} />
                )}
                <ErrorFormatted {...email.error} />
              </div>
            </div>
          )}

          {isName && (
            <div className="row mb-2">
              <div className="pl-4 col-5 py-0 label text-left">
                <Label required>
                  <FormattedMessage {...messages.full_name} />
                </Label>
              </div>
              <div className="col-7 pr-4">
                <Input
                  name="full_name"
                  {...full_name}
                  disabled={isConfirmStep}
                />
                <ErrorFormatted {...full_name.error} />
              </div>
            </div>
          )}

          {isTelNo && (
            <div className="row mb-2">
              <div className="pl-4 col-5 py-0 label text-left">
                <Label required>
                  <FormattedMessage {...messages.contact_no} />
                </Label>
              </div>
              <div className="col-7 pr-4">
                <Input
                  name="contact_no"
                  {...contact_no}
                  disabled={isConfirmStep}
                />
                <ErrorFormatted {...contact_no.error} />
              </div>
            </div>
          )}

          {isAddress && (
            <>
              <div className="row mb-2">
                <div className="pl-4 col-6 py-0 label text-left">
                  <Label>
                    <FormattedMessage {...messages.address} />
                  </Label>
                </div>
              </div>
              <div className="row mb-2">
                <div className="pl-4 col-5 py-0 label text-left">
                  <Label>
                    <FormattedMessage {...messages.zip_code} />
                  </Label>
                </div>
                <div className="col-7 pr-4">
                  <Input
                    name="zip_code"
                    {...zip_code}
                    disabled={isConfirmStep}
                  />
                  <ErrorFormatted {...zip_code.error} />
                </div>
              </div>
              <div className="row mb-2">
                <div className="pl-4 col-5 py-0 label text-left">
                  <Label>
                    <FormattedMessage {...messages.state} />
                  </Label>
                </div>
                <div className="col-7 pr-4">
                  <Input name="state" {...state} disabled={isConfirmStep} />
                  <ErrorFormatted {...state.error} />
                </div>
              </div>
              <div className="row mb-2">
                <div className="pl-4 col-5 py-0 label text-left">
                  <Label>
                    <FormattedMessage {...messages.city} />
                  </Label>
                </div>
                <div className="col-7 pr-4">
                  {isConfirmStep ? (
                    <Input name="city" disabled {...city} />
                  ) : (
                    <Input name="city" {...city} />
                  )}
                  <ErrorFormatted {...city.error} />
                </div>
              </div>
              <div className="row mb-2">
                <div className="pl-4 col-5 py-0 label text-left">
                  <Label>
                    <FormattedMessage {...messages.street} />
                  </Label>
                </div>
                <div className="col-7 pr-4">
                  {isConfirmStep ? (
                    <Input name="street" disabled {...street} />
                  ) : (
                    <Input name="street" {...street} />
                  )}
                  <ErrorFormatted {...street.error} />
                </div>
              </div>
              <div className="row mb-2">
                <div className="pl-4 col-5 py-0 label text-left">
                  <Label>
                    <FormattedMessage {...messages.building} />
                  </Label>
                </div>
                <div className="col-7 pr-4">
                  {isConfirmStep ? (
                    <Input name="building" disabled {...building} />
                  ) : (
                    <Input name="building" {...building} />
                  )}
                  <ErrorFormatted {...building.error} />
                </div>
              </div>
            </>
          )}
          <div className="mb-4" />
        </>
      )}
    </>
  );
};

DefaultPersonalInformation.propTypes = {
  inputFormFields: PropTypes.any,
  isConfirmStep: PropTypes.bool,
  intl: PropTypes.any,
  payload: PropTypes.any,
  setInvalidDefault: PropTypes.any,
};

export default DefaultPersonalInformation;
