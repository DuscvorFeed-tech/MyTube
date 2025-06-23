/* eslint-disable camelcase */
/**
 *
 * FormPage
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createSelector } from 'reselect';

import Label from 'components/Label';
import Input from 'components/Input';
import Select from 'components/Select';
import ErrorFormatted from 'components/ErrorFormatted';

import Prefecture from 'utils/prefecture';
import { makeSelectLocale } from 'containers/LanguageProvider/selectors';
import messages from '../messages';
import useValidation, { isValid } from '../../../library/validator';
import validation from '../validators';

const ThankfulPerson1 = props => {
  const {
    inputFormFields = [],
    isConfirmStep,
    payload,
    setInvalidThankfulPerson1,
    locale,
    formFieldsRequired,
  } = props;

  const isEmail = inputFormFields.includes(Number(EnumFormFields.EMAIL));
  const isName = inputFormFields.includes(Number(EnumFormFields.NAME));
  const isTelNo = inputFormFields.includes(Number(EnumFormFields.TELNO));
  const isAddress = inputFormFields.includes(Number(EnumFormFields.ADDRESS));

  const isEmailReq = formFieldsRequired.includes(Number(EnumFormFields.EMAIL));
  const isNameReq = formFieldsRequired.includes(Number(EnumFormFields.NAME));
  const isTelNoReq = formFieldsRequired.includes(Number(EnumFormFields.TELNO));
  const isAddressReq = formFieldsRequired.includes(
    Number(EnumFormFields.ADDRESS),
  );

  const validator = validation(props.intl);
  const email = useValidation('', validator.email(isEmail, isEmailReq));
  const name = useValidation('', validator.name(isName, isNameReq));
  const phone = useValidation('', validator.phone(isTelNo, isTelNoReq));
  const zip_code = useValidation(
    '',
    validator.zip_code(isAddress, isAddressReq),
  );
  const prefecture = useValidation(
    '',
    validator.prefecture(isAddress, isAddressReq),
  );
  const address1 = useValidation(
    '',
    validator.address1(isAddress, isAddressReq),
  );
  const address2 = useValidation(
    '',
    validator.address2(isAddress, isAddressReq),
  );
  const address3 = useValidation(
    '',
    validator.address3(isAddress, isAddressReq),
  );

  let emailInvalid = false;
  let nameInvalid = false;
  let contactInvalid = false;
  let addressInvalid = false;

  if (isEmail) {
    emailInvalid =
      (email.value === '' && isEmailReq) || email.value.length > 100;
    payload.thankful1_email = email.value;
  }

  if (isName) {
    nameInvalid =
      !isValid([name]) ||
      (name.value === '' && isNameReq) ||
      name.value.length > 50;
    payload.thankful1_name = name.value;
  }

  if (isTelNo) {
    contactInvalid =
      !isValid([phone]) ||
      (phone.value === '' && isTelNoReq) ||
      phone.value.length > 12;
    payload.thankful1_phone = phone.value;
  }

  if (isAddress) {
    payload.thankful1_zip_code = zip_code.value;
    payload.thankful1_prefecture = prefecture.value;
    payload.thankful1_address1 = address1.value;
    payload.thankful1_address2 = address2.value;
    payload.thankful1_address3 = address3.value;
    addressInvalid =
      !isValid([zip_code, prefecture, address1, address2]) ||
      (zip_code.value === '' && isAddressReq) ||
      zip_code.value.length > 8 ||
      (prefecture.value === '' && isAddressReq) ||
      (address1.value === '' && isAddressReq) ||
      address1.value.length > 100 ||
      (address2.value === '' && isAddressReq) ||
      address2.value.length > 100 ||
      address3.value.length > 100;
  }

  setInvalidThankfulPerson1(
    emailInvalid || nameInvalid || contactInvalid || addressInvalid,
  );

  return (
    <>
      {inputFormFields.length > 0 && (
        <>
          <div
            className="col-12 title text-left pt-3 pb-1"
            style={{ textTransform: 'none' }}
          >
            ◆ <FormattedMessage {...messages.thankfulPerson} /> 1
          </div>
          {isName && (
            <div className="row mb-2">
              <div className="pl-4 col-5 py-0 label text-left">
                <Label required={isNameReq}>
                  <FormattedMessage {...messages.name} />
                </Label>
              </div>
              <div className="col-7 pr-4 text-left">
                {isConfirmStep && (
                  <span style={{ padding: '6px 15px' }}>{name.value}</span>
                )}
                {!isConfirmStep && <Input name="name" {...name} />}
                <ErrorFormatted {...name.error} />
              </div>
            </div>
          )}

          {isEmail && (
            <div className="row mb-2">
              <div className="pl-4 col-5 py-0 label text-left">
                <Label required={isEmailReq}>
                  <FormattedMessage {...messages.email} />
                </Label>
              </div>
              <div className="col-7 pr-4 text-left">
                {isConfirmStep ? (
                  <span style={{ padding: '6px 15px' }}>{email.value}</span>
                ) : (
                  <Input name="email" {...email} />
                )}
                {email.value.length > 0 && <ErrorFormatted {...email.error} />}
              </div>
            </div>
          )}

          {isTelNo && (
            <div className="row mb-2">
              <div className="pl-4 col-5 py-0 label text-left">
                <Label required={isTelNoReq}>
                  <FormattedMessage {...messages.phone} />
                </Label>
              </div>
              <div className="col-7 pr-4 text-left">
                {isConfirmStep ? (
                  <span style={{ padding: '6px 15px' }}>{phone.value}</span>
                ) : (
                  <Input name="phone" {...phone} />
                )}
                <ErrorFormatted {...phone.error} />
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
                  <Label required={isAddressReq}>
                    <FormattedMessage {...messages.zip_code} />
                  </Label>
                </div>
                <div className="col-7 pr-4 text-left">
                  {isConfirmStep ? (
                    <span style={{ padding: '6px 15px' }}>
                      {zip_code.value}
                    </span>
                  ) : (
                    <Input name="zip_code" {...zip_code} />
                  )}
                  <ErrorFormatted {...zip_code.error} />
                </div>
              </div>
              <div className="row mb-2">
                <div className="pl-4 col-5 py-0 label text-left">
                  <Label required={isAddressReq}>
                    <FormattedMessage {...messages.prefecture} />
                  </Label>
                </div>
                <div className="col-7 pr-4 text-left">
                  <Select
                    id="prefecture"
                    name="prefecture"
                    {...prefecture}
                    disabled={isConfirmStep}
                    className={isConfirmStep ? 'pl-3' : ''}
                    lightFontWeight
                  >
                    <option />
                    {Prefecture.map(p => (
                      <option key={Number(p.id)} value={Number(p.id)}>
                        {locale === 'en' ? p.english : p.japanese}
                      </option>
                    ))}
                  </Select>
                  <ErrorFormatted {...prefecture.error} />
                </div>
              </div>
              <div className="row mb-2">
                <div className="pl-4 col-5 py-0 label text-left">
                  <Label required={isAddressReq}>
                    <FormattedMessage {...messages.address1} />
                  </Label>
                </div>
                <div className="col-7 pr-4 text-left">
                  {isConfirmStep ? (
                    <span style={{ padding: '6px 15px' }}>
                      {address1.value}
                    </span>
                  ) : (
                    <Input name="address1" {...address1} />
                  )}
                  <ErrorFormatted {...address1.error} />
                </div>
              </div>
              <div className="row mb-2">
                <div className="pl-4 col-5 py-0 label text-left">
                  <Label required={isAddressReq}>
                    <FormattedMessage {...messages.address2} />
                  </Label>
                </div>
                <div className="col-7 pr-4 text-left">
                  {isConfirmStep ? (
                    <span style={{ padding: '6px 15px' }}>
                      {address2.value}
                    </span>
                  ) : (
                    <Input name="address2" {...address2} />
                  )}
                  <ErrorFormatted {...address2.error} />
                </div>
              </div>
              <div className="row mb-2">
                <div className="pl-4 col-5 py-0 label text-left">
                  <Label>
                    <FormattedMessage {...messages.address3} />
                  </Label>
                </div>
                <div className="col-7 pr-4 text-left">
                  {isConfirmStep ? (
                    <span style={{ padding: '6px 15px' }}>
                      {address3.value}
                    </span>
                  ) : (
                    <Input name="address3" {...address3} />
                  )}
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

ThankfulPerson1.propTypes = {
  inputFormFields: PropTypes.any,
  isConfirmStep: PropTypes.bool,
  intl: PropTypes.any,
  payload: PropTypes.any,
  setInvalidThankfulPerson1: PropTypes.any,
  locale: PropTypes.string,
  formFieldsRequired: PropTypes.any,
};

const mapStateToProps = createSelector(
  makeSelectLocale(),
  locale => ({
    locale,
  }),
);

const withConnect = connect(
  mapStateToProps,
  null,
);

export default compose(
  withConnect,
  memo,
  injectIntl,
)(ThankfulPerson1);
