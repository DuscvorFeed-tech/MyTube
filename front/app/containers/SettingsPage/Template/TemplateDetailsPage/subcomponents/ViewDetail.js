import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { compose } from 'redux';

import Img from 'components/Img';
import Title from 'components/Title';
import Label from 'components/Label';
import VideoWrapper from 'components/Video';

import { config } from 'utils/config';

import messages from '../messages';

export function ViewDetail({
  commonTypes,
  theme,
  templateName,
  templateType,
  templateCategory,
  templateDescription,
  intl,
  validatorEffect: { content, uploadFiles, fileType },
}) {
  const { MessageTemplateType, TemplateCategory } = commonTypes;

  return (
    <div className="p-5 d-block col-lg-7 border-left">
      <div className="row mb-4">
        <Title main size={theme.fontSize.md} color={theme.secondaryDark}>
          {intl.formatMessage({ ...messages.viewDetails })}
        </Title>
      </div>
      <div className="row ml-1">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left">
            <Label className="pl-0">
              {intl.formatMessage({ ...messages.templateName })}
            </Label>
          </div>
          <div className="col-md-12 text-left">
            <span>{templateName.value}</span>
          </div>
        </div>
      </div>
      <div className="row ml-1">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left">
            <Label className="pl-0">
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
          </div>
        </div>
      </div>
      <div className="row ml-1">
        <div className="row align-items-baseline pb-3 col-lg-12">
          <div className="col-md-12 text-left">
            <Label className="pl-0">
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
            <span style={{ whiteSpace: 'pre-line' }}>
              {templateDescription.value}
            </span>
          </div>
        </div>
      </div>
      <div className="row ml-1">
        <div className="row align-items-center pb-3 col-lg-12 display-contents">
          <div className="col-md-12 text-left">
            <Label className="pl-0">
              {intl.formatMessage({ ...messages.templateContent })}
            </Label>
          </div>
          <div className="col-md-12 text-left">
            {uploadFiles &&
              uploadFiles.length > 0 &&
              uploadFiles.map((x, idx) => {
                if (typeof x === 'string') {
                  if (fileType === 'VIDEO') {
                    return (
                      <div className="mt-4" key={Number(idx)}>
                        <VideoWrapper
                          src={`${config.API_URL}/images?filename=${x}`}
                        />
                      </div>
                    );
                  }
                  return (
                    <div className="mt-4" key={Number(idx)}>
                      <Img src={`${config.API_URL}/images?filename=${x}`} />
                    </div>
                  );
                }
                return (
                  <div className="mt-2" key={Number(idx)}>
                    <Img src={URL.createObjectURL(x)} alt="image" />
                  </div>
                );
              })}
            {content && content.value && (
              <div className="text-justify" style={{ whiteSpace: 'pre-line' }}>
                {content.value}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

ViewDetail.propTypes = {
  commonTypes: PropTypes.object,
  theme: PropTypes.any,
  templateName: PropTypes.any,
  templateType: PropTypes.any,
  templateCategory: PropTypes.any,
  templateDescription: PropTypes.any,
  intl: PropTypes.any,
  validatorEffect: PropTypes.object,
};

export default compose(injectIntl)(ViewDetail);
