/**
 *
 * TemplatePreview
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { compose } from 'redux';
import Img from 'components/Img';
// import styled from 'styled-components';
import { config } from 'utils/config';
import IcoFont from 'react-icofont';
import StyledTags from './StyledTags';
import messages from './messages';

function TemplatePreview(props) {
  const { content, uploadFiles, isPending, intl } = props;
  return (
    <div className="row justify-content-center my-4">
      <div className="col-md-10 mb-3">
        <div className="bubble-wrapper">
          <IcoFont icon="icofont-user-alt-3" />
          <div
            className="bubble text-justify"
            style={{ whiteSpace: 'pre-line' }}
          >
            {uploadFiles &&
              !isPending &&
              uploadFiles.length > 0 &&
              uploadFiles.map((x, idx) => {
                if (typeof x === 'string') {
                  return (
                    <div className="mt-4" key={Number(idx)}>
                      <Img src={`${config.API_URL}/images?filename=${x}`} />
                    </div>
                  );
                }
                return (
                  <div className="mt-4" key={Number(idx)}>
                    <Img src={URL.createObjectURL(x)} alt="image" />
                  </div>
                );
              })}
            {isPending && (
              <StyledTags className="card">
                <div className="card-body">
                  <h5 className="card-text">
                    {intl.formatMessage({
                      ...messages.dmMediaPending,
                    })}
                  </h5>
                </div>
              </StyledTags>
            )}

            {content}
          </div>
        </div>
      </div>
    </div>
  );
}

TemplatePreview.propTypes = {
  content: PropTypes.string,
  uploadFiles: PropTypes.any,
  intl: intlShape,
  isPending: PropTypes.bool,
};

export default compose(
  memo,
  injectIntl,
)(TemplatePreview);
