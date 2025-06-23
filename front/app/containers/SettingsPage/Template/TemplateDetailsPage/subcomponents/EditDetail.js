import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl } from 'react-intl';
import { compose } from 'redux';

import Title from 'components/Title';
import Label from 'components/Label';
import Input from 'components/Input';
import PostTweet from 'components/PostTweet';
import Textarea from 'components/Textarea';

import ErrorFormatted from 'components/ErrorFormatted';
import messages from '../messages';

export function EditDetail({
  commonTypes,
  intl,
  errors,
  theme,
  templateName,
  templateType,
  templateCategory,
  templateDescription,
  validatorEffect: {
    content,
    imageFile,
    gifFile,
    videoFile,
    uploadFiles,
    fileType,
    uploadError,
    onRemove,
  },
}) {
  const { TemplateCategory, MessageTemplateType } = commonTypes;
  return (
    <div className="p-5 d-block col-lg-7 border-left">
      <div className="row mb-4">
        <Title main size={theme.fontSize.md} color={theme.secondaryDark}>
          {intl.formatMessage({ ...messages.editTemplate })}
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
              {intl.formatMessage({ ...messages.templateName })}
            </Label>
          </div>
          <div className="col-md-12 text-left">
            <Input name="templateName" {...templateName} />
            <ErrorFormatted {...templateName.error} />
          </div>
        </div>
      </div>
      <div className="row ml-1">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left">
            <Label required className="pl-0">
              {intl.formatMessage({ ...messages.type })}
            </Label>
          </div>
          <div className="col-md-12 text-left">
            {MessageTemplateType && (
              <span>
                {templateType.value &&
                  intl.formatMessage({
                    id: `messageTemplate${templateType.value}`,
                    defaultMessage: MessageTemplateType.find(
                      f => f.value === Number(templateType.value),
                    ).name,
                  })}
              </span>
            )}
            <ErrorFormatted {...templateType.error} />
          </div>
        </div>
      </div>
      <div className="row ml-1">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left">
            <Label required className="pl-0">
              {intl.formatMessage({ ...messages.category })}
            </Label>
          </div>
          <div className="col-md-12 text-left">
            {TemplateCategory && (
              <span>
                {templateCategory.value &&
                  intl.formatMessage({
                    id: `templateCategory${templateCategory.value}`,
                    defaultMessage: TemplateCategory.find(
                      f => f.value === templateCategory.value,
                    ).name,
                  })}
              </span>
            )}
            <ErrorFormatted {...templateCategory.error} />
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
                {...templateDescription}
                className="withHolder"
                placeholder="Write description here."
                cols="35"
                rows={
                  templateDescription.value
                    ? templateDescription.value.split(/\r\n|\r|\n/).length + 1
                    : 1
                }
                maxHeight={1500}
                minHeight={5}
              />
            </div>
            <ErrorFormatted {...templateDescription.error} />
          </div>
        </div>
      </div>
      <div className="row ml-1">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left">
            <Label required className="pl-0">
              {intl.formatMessage({ ...messages.templateContent })}
            </Label>
          </div>
          <div className="col-md-12 text-left">
            <PostTweet
              intl={intl}
              noTextLimit={false}
              noVideo={Number(templateType) === 1}
              {...content}
              imagesFile={imageFile}
              gifFile={gifFile}
              videoFile={videoFile}
              uploadFiles={uploadFiles}
              fileType={fileType}
              uploadError={uploadError}
              onRemove={onRemove}
              noMulitple
              noImage={uploadFiles.length > 0}
              noGif={uploadFiles.length > 0}
              mediaTop
            />
            {errors && (
              <ErrorFormatted
                invalid
                list={errors.list}
                names={['content']}
                customName="templateContent"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

EditDetail.propTypes = {
  errors: PropTypes.object,
  theme: PropTypes.any,
  commonTypes: PropTypes.object,
  templateName: PropTypes.any,
  templateType: PropTypes.any,
  templateCategory: PropTypes.any,
  templateDescription: PropTypes.any,
  templateContent: PropTypes.any,
  intl: PropTypes.any,
  validatorEffect: PropTypes.object,
};

export default compose(injectIntl)(EditDetail);
