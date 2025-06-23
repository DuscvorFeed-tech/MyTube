import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { compose } from 'redux';

import Label from 'components/Label';
import Input from 'components/Input';
import Textarea from 'components/Textarea';
import Title from 'components/Title';
import FileUpload from 'components/FileUpload';
import ErrorFormatted from 'components/ErrorFormatted';
import FormImage from 'components/FormImage';

import messages from '../messages';

export function AddForm({
  errors,
  theme,
  formName,
  description,
  imageHeader,
  title,
  content,
  footer,
  intl,
  onRemove,
}) {
  return (
    <div className="p-5 d-block col-lg-7 border-left">
      <div className="row mb-4">
        <Title main size={theme.fontSize.md} color={theme.secondaryDark}>
          {intl.formatMessage({ ...messages.addForm })}
        </Title>
      </div>
      <div className="row ml-1">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left">
            <Label required className="pl-0">
              {intl.formatMessage({ ...messages.formName })}
            </Label>
          </div>
          <div className="col-md-12 text-left">
            <Input name="name" {...formName} />
            <ErrorFormatted {...formName.error} />
            {errors && (
              <ErrorFormatted
                invalid
                list={errors.list}
                names={['name']}
                customName="formName"
              />
            )}
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
            <div className="dynamic-textarea-holder">
              <Textarea
                name="description"
                {...description}
                className="withHolder"
                placeholder="Write description here."
                cols="35"
                rows={
                  description.value
                    ? description.value.split(/\r\n|\r|\n/).length + 1
                    : 1
                }
                maxHeight={1500}
                minHeight={5}
              />
            </div>
            <ErrorFormatted {...description.error} />
          </div>
        </div>
      </div>
      <div className="row ml-1">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left">
            <Label className="pl-0">
              {intl.formatMessage({ ...messages.imageHeader })}
            </Label>
          </div>
          <div className="col-md-12 text-left">
            <FileUpload
              name="imageHeader"
              id="imageInput"
              label={intl.formatMessage({ ...messages.chooseFile })}
              accept=".jpg,.jpeg,.png"
              {...imageHeader}
            />
            {imageHeader.value && imageHeader.value.name ? (
              <span
                className="font-weight-bold text-dark"
                id="formImagePreview"
              >
                <FormImage
                  imgFile={URL.createObjectURL(imageHeader.value)}
                  showDelete
                  onRemove={onRemove}
                  width="30%"
                />
              </span>
            ) : null}
            <ErrorFormatted {...imageHeader.error} />
          </div>
        </div>
      </div>
      <div className="row ml-1">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left">
            <Label required className="pl-0">
              {intl.formatMessage({ ...messages.title })}
            </Label>
          </div>
          <div className="col-md-12 text-left">
            <Input name="title" {...title} />
            <ErrorFormatted {...title.error} />
            {errors && (
              <ErrorFormatted
                invalid
                list={errors.list}
                names={['title']}
                customName="title"
              />
            )}
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
                className="withHolder"
                placeholder="Write your post here."
                cols="35"
                rows="5"
                name="content"
                maxHeight={1500}
                minHeight={200}
                resize="vertical"
                {...content}
              />
              <ErrorFormatted {...content.error} />
              {errors && (
                <ErrorFormatted
                  invalid
                  list={errors.list}
                  names={['content']}
                  customName="content"
                />
              )}
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
            <div className="footer-textarea-holder">
              <Textarea
                className="withHolder"
                cols="35"
                rows="2"
                name="footer"
                maxHeight={500}
                minHeight={65}
                resize="vertical"
                {...footer}
              />
            </div>
            <ErrorFormatted {...footer.error} />
          </div>
        </div>
      </div>
    </div>
  );
}

AddForm.propTypes = {
  errors: PropTypes.any,
  theme: PropTypes.any,
  formName: PropTypes.any,
  imageHeader: PropTypes.any,
  description: PropTypes.any,
  title: PropTypes.any,
  content: PropTypes.any,
  footer: PropTypes.any,
  intl: intlShape.isRequired,
  onRemove: PropTypes.func,
};

export default compose(injectIntl)(AddForm);
