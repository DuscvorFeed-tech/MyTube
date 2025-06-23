import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createSelector } from 'reselect';

import Label from 'components/Label';
import Input from 'components/Input';
import Textarea from 'components/Textarea';
import Select from 'components/Select';

import { makeSelectLocale } from 'containers/LanguageProvider/selectors';

import Prefecture from 'utils/prefecture';
import messages from '../messages';

const PersonalInformation = props => {
  const {
    inputFormFields = [],
    inputFormFieldsRequired = [],
    formDesign,
    locale,
  } = props;
  const isShowTextBox =
    (!formDesign || formDesign === 1) &&
    inputFormFields.includes(EnumFormFields.TEXTBOX);
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
          {inputFormFields.includes(EnumFormFields.NAME) && (
            <div className="row mb-2">
              <div className="pl-4 col-5 py-0 label">
                <Label
                  required={inputFormFieldsRequired.includes(
                    EnumFormFields.NAME,
                  )}
                >
                  <FormattedMessage {...messages.name} />
                </Label>
              </div>
              <div className="col-7 pr-4">
                <Input name="name" />
              </div>
            </div>
          )}
          {inputFormFields.includes(EnumFormFields.EMAIL) && (
            <div className="row mb-2">
              <div className="pl-4 col-5 py-0 label">
                <Label
                  required={inputFormFieldsRequired.includes(
                    EnumFormFields.EMAIL,
                  )}
                >
                  <FormattedMessage {...messages.email} />
                </Label>
              </div>
              <div className="col-7 pr-4">
                <Input name="email" />
              </div>
            </div>
          )}
          {inputFormFields.includes(EnumFormFields.TELNO) && (
            <div className="row mb-2">
              <div className="pl-4 col-5 py-0 label">
                <Label
                  required={inputFormFieldsRequired.includes(
                    EnumFormFields.TELNO,
                  )}
                >
                  <FormattedMessage {...messages.phone} />
                </Label>
              </div>
              <div className="col-7 pr-4">
                <Input name="phone" />
              </div>
            </div>
          )}
          {inputFormFields.includes(EnumFormFields.ADDRESS) && (
            <>
              <div className="row mb-2">
                <div className="pl-4 col-5 py-0 label">
                  <Label>
                    <FormattedMessage {...messages.address} />
                  </Label>
                </div>
              </div>
              <div className="row mb-2">
                <div className="pl-4 col-5 py-0 label">
                  <Label
                    required={inputFormFieldsRequired.includes(
                      EnumFormFields.ADDRESS,
                    )}
                  >
                    <FormattedMessage {...messages.zip_code} />
                  </Label>
                </div>
                <div className="col-7 pr-4">
                  <Input name="zip_code" />
                </div>
              </div>
              <div className="row mb-2">
                <div className="pl-4 col-5 py-0 label">
                  <Label
                    required={inputFormFieldsRequired.includes(
                      EnumFormFields.ADDRESS,
                    )}
                  >
                    <FormattedMessage {...messages.prefecture} />
                  </Label>
                </div>
                <div className="col-7 pr-4">
                  <Select id="prefecture" name="prefecture">
                    <option />
                    {Prefecture.map(p => (
                      <option key={Number(p.id)} value={Number(p.id)}>
                        {locale === 'en' ? p.english : p.japanese}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="row mb-2">
                <div className="pl-4 col-5 py-0 label">
                  <Label
                    required={inputFormFieldsRequired.includes(
                      EnumFormFields.ADDRESS,
                    )}
                  >
                    <FormattedMessage {...messages.address1} />
                  </Label>
                </div>
                <div className="col-7 pr-4">
                  <Input name="address1" />
                </div>
              </div>
              <div className="row mb-2">
                <div className="pl-4 col-5 py-0 label">
                  <Label
                    required={inputFormFieldsRequired.includes(
                      EnumFormFields.ADDRESS,
                    )}
                  >
                    <FormattedMessage {...messages.address2} />
                  </Label>
                </div>
                <div className="col-7 pr-4">
                  <Input name="address2" />
                </div>
              </div>
              <div className="row mb-2">
                <div className="pl-4 col-5 py-0 label">
                  <Label>
                    <FormattedMessage {...messages.address3} />
                  </Label>
                </div>
                <div className="col-7 pr-4">
                  <Input name="address3" />
                </div>
              </div>
            </>
          )}
          {isShowTextBox && (
            <div className="row mb-2">
              <div className="pl-4 col-5 py-0 label">
                <Label
                  required={inputFormFieldsRequired.includes(
                    EnumFormFields.TEXTBOX,
                  )}
                >
                  <FormattedMessage {...messages.formTextbox} />
                </Label>
              </div>
              <div className="col-7 pr-4 text-left">
                <div
                  className="dynamic-textarea-holder pl-2 pr-2"
                  style={{ background: '#F7F7F7' }}
                >
                  <Textarea
                    bgray
                    name="textbox"
                    className="withHolder"
                    cols="29"
                    rows="6"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="mb-4" />
        </>
      )}
    </>
  );
};

PersonalInformation.propTypes = {
  inputFormFields: PropTypes.any,
  formDesign: PropTypes.any,
  intl: PropTypes.any,
  locale: PropTypes.string,
  inputFormFieldsRequired: PropTypes.any,
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
)(PersonalInformation);
