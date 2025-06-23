/**
 *
 * AddTemplatePage
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { compose } from 'redux';

import Title from 'components/Title';
import Label from 'components/Label';
import Input from 'components/Input';
import Select from 'components/Select';
import PostTweet from 'components/PostTweet';
import ErrorFormatted from 'components/ErrorFormatted';
import Textarea from 'components/Textarea';
import messages from '../messages';
// import Img from 'components/Img';
// import VideoWrapper from 'components/Video';

export function AddTemplate({
  errors,
  theme,
  templateName,
  templateTypeValue,
  templateCategory,
  templateDescription,
  commonTypes,
  intl,
  validatorEffect: {
    content,
    imageFile,
    gifFile,
    videoFile,
    uploadFiles,
    fileType,
    uploadError,
    onRemove,
    setUploadFile,
  },
}) {
  useEffect(() => {
    setUploadFile([]);
  }, [templateTypeValue]);

  const TemplateCategory =
    commonTypes && commonTypes.find(f => f.type === 'TemplateCategory');

  return (
    <div className="p-5 d-block col-lg-7 border-left">
      <div className="row mb-4">
        <Title main size={theme.fontSize.md} color={theme.secondaryDark}>
          {intl.formatMessage({ ...messages.addMessageTemplate })}
        </Title>
      </div>
      <div className="row">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left">
            <Label required className="pl-0">
              {intl.formatMessage({ ...messages.templateName })}
            </Label>
          </div>
          <div className="col-md-12 text-left">
            <Input name="templateName" {...templateName} />
            <ErrorFormatted {...templateName.error} />
            {errors && (
              <ErrorFormatted
                invalid
                list={errors.list}
                names={['name']}
                customName="templateName"
              />
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left">
            <Label required className="pl-0">
              {intl.formatMessage({ ...messages.category })}
            </Label>
          </div>
          <div className="col-md-12 text-left">
            <Select bordered {...templateCategory}>
              <option value="">
                {intl.formatMessage(
                  { id: 'T0000021' },
                  { name: intl.formatMessage({ ...messages.category }) },
                )}
              </option>
              {TemplateCategory &&
                TemplateCategory.data.map(m => (
                  <option key={m.value} value={m.value}>
                    {intl.formatMessage({
                      id: `templateCategory${m.value}`,
                      defaultMessage: m.name,
                    })}
                  </option>
                ))}
            </Select>
            <ErrorFormatted {...templateCategory.error} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="row align-items-baseline pb-3 col-lg-12 mt-3">
          <div className="col-md-12 text-left mb-auto">
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
      <div className="row">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left mb-auto">
            <Label required className="pl-0">
              {intl.formatMessage({ ...messages.templateContent })}
            </Label>
          </div>
          <div className="col-md-12 text-left">
            <PostTweet
              intl={intl}
              noTextLimit={false}
              noVideo={Number(templateTypeValue) === 1}
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

AddTemplate.propTypes = {
  errors: PropTypes.any,
  theme: PropTypes.any,
  commonTypes: PropTypes.any,
  templateName: PropTypes.any,
  templateTypeValue: PropTypes.any,
  templateDescription: PropTypes.any,
  templateContent: PropTypes.any,
  templateCategory: PropTypes.any,
  intl: intlShape.isRequired,
  validatorEffect: PropTypes.object,
};

export default compose(injectIntl)(AddTemplate);
