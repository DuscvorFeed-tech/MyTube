import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { compose } from 'redux';

import Title from 'components/Title';
import Img from 'components/Img';
import Label from 'components/Label';
import Input from 'components/Input';

import { config } from 'utils/config';

import messages from '../messages';

export function PreviewDetail({
  formImageHeader,
  formTitle,
  formContent,
  formFooter,
  theme,
  intl,
}) {
  return (
    <div className="p-5 d-block col-lg-5 border-left">
      <Title main size={theme.fontSize.md} color={theme.secondaryDark}>
        {intl.formatMessage({ ...messages.preview })}
      </Title>
      <div className="textarea-holder mt-3 w-auto p-3 h-auto">
        <div className="pt-5 text-center">
          {formImageHeader.value && (
            <Img
              src={
                formImageHeader.value.name !== undefined
                  ? URL.createObjectURL(formImageHeader.value)
                  : `${config.FORM_IMAGE}?filename=${formImageHeader.value}`
              }
            />
          )}
        </div>
        <div>
          <div className="pt-5">
            <Title
              main
              size={theme.fontSize.md}
              color={theme.secondaryDark}
              noTextTransform
            >
              {formTitle.value}
            </Title>
          </div>
          <div className="pt-5" style={{ whiteSpace: 'pre-line' }}>
            <p>{formContent.value}</p>
          </div>
          <div className="row mb-2">
            <div className="pl-4 col-5 py-0 label text-left">
              <Label required>
                <FormattedMessage {...messages.email} />
              </Label>
            </div>
            <div className="col-7 pr-4">
              <Input name="email" />
            </div>
          </div>
          <div className="row mb-2">
            <div className="pl-4 col-5 py-0 label text-left">
              <Label required>
                <FormattedMessage {...messages.full_name} />
              </Label>
            </div>
            <div className="col-7 pr-4">
              <Input name="full_name" />
            </div>
          </div>
          <div className="row mb-2">
            <div className="pl-4 col-5 py-0 label text-left">
              <Label required>
                <FormattedMessage {...messages.contact_no} />
              </Label>
            </div>
            <div className="col-7 pr-4">
              <Input name="contact_no" />
            </div>
          </div>
          <div className="pt-5 pb-4" style={{ whiteSpace: 'pre-line' }}>
            <p className="text-left small">
              <strong>{formFooter.value}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

PreviewDetail.propTypes = {
  formImageHeader: PropTypes.any,
  formTitle: PropTypes.any,
  formContent: PropTypes.any,
  formFooter: PropTypes.any,
  theme: PropTypes.any,
  intl: intlShape.isRequired,
};

export default compose(injectIntl)(PreviewDetail);
