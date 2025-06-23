import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { compose } from 'redux';

import Title from 'components/Title';
import Label from 'components/Label';
import Input from 'components/Input';
import FormImage from 'components/FormImage';

import messages from '../messages';

export function Preview({ imageHeader, title, content, footer, theme, intl }) {
  return (
    <div className="p-5 d-block col-lg-5 border-left">
      <Title main size={theme.fontSize.md} color={theme.secondaryDark}>
        {intl.formatMessage({ ...messages.preview })}
      </Title>
      <div className="textarea-holder mt-3 w-auto p-3 h-auto">
        <div className="pt-5">
          {imageHeader.value && imageHeader.value.name ? (
            <FormImage
              imgFile={URL.createObjectURL(imageHeader.value)}
              showDelete={false}
            />
          ) : null}
        </div>
        <div>
          <div className="pt-5">
            <Title
              main
              size={theme.fontSize.md}
              color={theme.secondaryDark}
              noTextTransform
            >
              {title.value}
            </Title>
          </div>
          <div className="pt-5" style={{ whiteSpace: 'pre-line' }}>
            <p style={{ textAlign: 'left' }}>{content.value}</p>
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
              <strong>{footer.value}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

Preview.propTypes = {
  theme: PropTypes.any,
  title: PropTypes.any,
  content: PropTypes.any,
  footer: PropTypes.any,
  imageHeader: PropTypes.any,
  intl: intlShape.isRequired,
};

export default compose(injectIntl)(Preview);
