import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl, intlShape } from 'react-intl';
import { compose } from 'redux';

import Title from 'components/Title';
import Label from 'components/Label';
import Img from 'components/Img';

import { config } from 'utils/config';

import messages from '../messages';

export function ViewDetail({
  formName,
  formDescription,
  formImageHeader,
  formTitle,
  formContent,
  formFooter,
  theme,
  intl,
}) {
  return (
    <div className="p-5 d-block col-lg-7 border-left">
      <div className="row mb-4">
        <Title
          main
          size={theme.fontSize.md}
          color={theme.secondaryDark}
          noTextTransform
        >
          {intl.formatMessage({ ...messages.viewForm })}
        </Title>
      </div>
      <div className="row ml-1">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left">
            <Label className="pl-0">
              {intl.formatMessage({ ...messages.formName })}
            </Label>
          </div>
          <div className="col-md-12 text-left">
            <span>{formName.value}</span>
          </div>
        </div>
      </div>
      <div className="row ml-1">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left">
            <Label className="pl-0">
              {intl.formatMessage({ ...messages.description })}
            </Label>
          </div>
          <div className="col-md-12 text-left">
            <span>
              {formDescription.value && formDescription.value.length
                ? formDescription.value
                : '_'}
            </span>
          </div>
        </div>
      </div>
      {formImageHeader.value && (
        <div className="row ml-1">
          <div className="row align-items-baseline pb-3 col-lg-12">
            <div className="col-md-12 text-left">
              <Label className="pl-0">
                {intl.formatMessage({ ...messages.imageHeader })}
              </Label>
            </div>
            <div className="col-md-12 text-left">
              <Img
                src={`${config.FORM_IMAGE}?filename=${formImageHeader.value}`}
                width="30%"
              />
            </div>
          </div>
        </div>
      )}
      <div className="row ml-1">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left">
            <Label className="pl-0">
              {intl.formatMessage({ ...messages.title })}
            </Label>
          </div>
          <div className="col-md-12 text-left">
            <span>{formTitle.value}</span>
          </div>
        </div>
      </div>
      <div className="row ml-1">
        <div className="row align-items-center col-lg-12">
          <div className="col-md-12 text-left">
            <Label className="pl-0">
              {intl.formatMessage({ ...messages.content })}
            </Label>
          </div>
          <div className="col-md-12 text-left">
            <div className="align-items-center">
              <p style={{ whiteSpace: 'pre-line' }}>{formContent.value}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row ml-1">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left">
            <Label className="pl-0">
              {intl.formatMessage({ ...messages.footer })}
            </Label>
          </div>
          <div className="col-md-12 text-left">
            <div className="align-items-center ">
              <p style={{ whiteSpace: 'pre-line' }}>{formFooter.value}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ViewDetail.propTypes = {
  formName: PropTypes.any,
  formDescription: PropTypes.any,
  formImageHeader: PropTypes.any,
  formTitle: PropTypes.any,
  formContent: PropTypes.any,
  formFooter: PropTypes.any,
  theme: PropTypes.any,
  intl: intlShape.isRequired,
};

export default compose(injectIntl)(ViewDetail);
