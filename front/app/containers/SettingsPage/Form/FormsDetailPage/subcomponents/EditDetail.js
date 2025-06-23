/* eslint-disable prettier/prettier */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { compose } from 'redux';

import Title from 'components/Title';
import ErrorFormatted from 'components/ErrorFormatted';
import Label from 'components/Label';
import Input from 'components/Input';
import FileUpload from 'components/FileUpload';
import Textarea from 'components/Textarea';
import FormImage from 'components/FormImage';

import { config } from 'utils/config';

import messages from '../messages';

export function EditDetail({
  errors,
  theme,
  formName,
  formDescription,
  formImageHeader,
  formTitle,
  formContent,
  formFooter,
  intl,
  onRemove,
}) {
  return (
    <div className="p-5 d-block col-lg-7 border-left">
      <div className="row mb-4">
        <Title main size={theme.fontSize.md} color={theme.secondaryDark}>
          {intl.formatMessage({ ...messages.editForm })}
        </Title>
      </div>
      <div className="row align-items-baseline pb-3 col-lg-12 ml-1">
        <div className="col-md-12 text-left">
          {errors && <ErrorFormatted invalid list={errors.list} />}
        </div>
      </div>
      <div className="row ml-1">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left">
            <Label required className="pl-0">
              {intl.formatMessage({ ...messages.formName })}
            </Label>
          </div>
          <div className="col-md-12 text-left">
            <Input name="formName" {...formName} />
            <ErrorFormatted {...formName.error} />
          </div>
        </div>
      </div>
      <div className="row ml-1">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left">
            <Label className="pl-0">{intl.formatMessage({ ...messages.description })}</Label>
          </div>
          <div className="col-md-12 text-left">
            <div className="dynamic-textarea-holder">
              <Textarea
                name="description"
                {...formDescription}
                className="withHolder"
                placeholder="Write description here."
                cols="35"
                rows={
                  formDescription.value
                    ? formDescription.value.split(/\r\n|\r|\n/).length + 1
                    : 1
                }
                maxHeight={1500}
                minHeight={5}
              />
            </div>
            <ErrorFormatted {...formDescription.error} />
          </div>
        </div>
      </div>
      <div className="row ml-1">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left">
            <Label className="pl-0">{intl.formatMessage({ ...messages.imageHeader })}</Label>
          </div>
          <div className="col-md-12 text-left">
            <div>
              <FileUpload
                label="Choose File"
                name="formImageHeader"
                id="imageInput"
                accept=".jpg,.jpeg,.png"
                {...formImageHeader}
              />
              {formImageHeader.value ? (
                <span
                  className="font-weight-bold text-dark"
                  id="formImagePreview"
                >
                  <FormImage
                    imgFile={
                      formImageHeader.value.name === undefined
                        ? `${config.FORM_IMAGE}?filename=${
                          formImageHeader.value
                        }`
                        : URL.createObjectURL(formImageHeader.value)
                    }
                    showDelete
                    onRemove={onRemove}
                    width="30%"
                  />
                </span>
              ) : null}
              <ErrorFormatted {...formImageHeader.error} />
            </div>
          </div>
        </div>
      </div>
      <div className="row ml-1">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left">
            <Label required className="pl-0">{intl.formatMessage({ ...messages.title })}</Label>
          </div>
          <div className="col-md-12 text-left">
            <Input name="formTitle" {...formTitle} />
            <ErrorFormatted {...formTitle.error} />
          </div>
        </div>
      </div>
      <div className="row ml-1">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left">
            <Label required className="pl-0">
              {intl.formatMessage({ ...messages.content })}
            </Label>
          </div>
          <div className="col-md-12 text-left">
            <div className="textarea-holder">
              <Textarea
                name="formContent"
                className="withHolder"
                placeholder="Write your post here."
                cols={35}
                rows={5}
                maxLength={1000}
                maxHeight={1500}
                minHeight={200}
                resize="vertical"
                {...formContent}
              />
            </div>
          </div>
          <ErrorFormatted {...formContent.error} />
        </div>
      </div>
      <div className="row ml-1">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left">
            <Label className="pl-0">{intl.formatMessage({ ...messages.footer })}</Label>
          </div>
          <div className="col-md-12 text-left">
            <div className="footer-textarea-holder">
              <Textarea
                className="withHolder"
                cols="35"
                rows="2"
                name="footer"
                maxHeight={500}
                minHeight={65}
                resize="vertical"
                {...formFooter}
              />
            </div>
            <ErrorFormatted {...formFooter.error} />
          </div>
        </div>
      </div>
    </div>
  );
}

EditDetail.propTypes = {
  formName: PropTypes.any,
  formDescription: PropTypes.any,
  formImageHeader: PropTypes.any,
  formTitle: PropTypes.any,
  formContent: PropTypes.any,
  formFooter: PropTypes.any,
  errors: PropTypes.any,
  theme: PropTypes.any,
  intl: intlShape.isRequired,
  onRemove: PropTypes.func,
};

export default compose(injectIntl)(EditDetail);
