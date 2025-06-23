/* eslint-disable no-nested-ternary */
/**
 *
 * PostTweet
 *
 */

import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import styled, { css } from 'styled-components';
import IcoFont from 'react-icofont';

import { config } from 'utils/config';

import Text from 'components/Text';
import Textarea from 'components/Textarea';
import TweetImage from 'components/TweetImage';
import FileUpload from 'components/FileUpload';
import VideoWrapper from 'components/Video';
import ErrorFormatted from '../ErrorFormatted';
import messages from './messages';
import { TWEET_TEXT_LIMIT } from '../../library/commonValues';
// import ErrorFormatted from 'components/ErrorFormatted';

// import { MediaType } from 'library/commonValues';

// import messages from './messages';

const StyledDiv = styled.div`
  border: 1px solid #93939380;
  border-radius: 8px;
  min-height: 200px;

  ${props =>
    props.noBorder &&
    css`
      border: none !important;
    `}
`;

const ImageMemo = ({ imgFile, showDelete, onRemove }) => {
  const state = imgFile && imgFile.map(i => i.name || i).join('|');
  const tweetImage = useMemo(
    () => (
      <TweetImage
        imgFile={imgFile}
        showDelete={showDelete}
        onRemove={onRemove}
      />
    ),
    [state],
  );
  return tweetImage;
};

function PostTweet(props) {
  const {
    intl,
    imagesFile,
    gifFile,
    videoFile,
    uploadFiles,
    fileType,
    uploadError,
    onRemove,
    noTextLimit,
    noGif,
    noImage,
    noVideo,
    noBorder,
    noMulitple,
    showDelete = true,
    availableBytes,
    mediaTop,
  } = props;
  return (
    <>
      <div>
        <StyledDiv className="textarea-holder" noBorder={noBorder}>
          {!mediaTop && (
            <Textarea
              className="withHolder"
              placeholder={intl.formatMessage({ ...messages.M0000001 })}
              height={150}
              // maxLength={TWEET_TEXT_LIMIT}
              name="content"
              {...props}
            />
          )}
          <div className="col-12">
            {uploadFiles && uploadFiles.length > 0 && (
              <>
                {['PHOTO', 'GIF', '1', '2'].includes(fileType) ? (
                  <ImageMemo
                    imgFile={uploadFiles}
                    showDelete={showDelete}
                    onRemove={onRemove}
                  />
                ) : ['VIDEO', '3'].includes(fileType) ? (
                  <>
                    {uploadFiles &&
                      uploadFiles.map((itm, idx) => {
                        if (typeof itm === 'string' && !itm.includes('http')) {
                          return (
                            <VideoWrapper
                              key={Number(idx)}
                              src={`${config.API_URL}/images?filename=${itm}`}
                              showDelete
                              onRemove={onRemove}
                            />
                          );
                        }
                        return (
                          <VideoWrapper
                            key={Number(idx)}
                            src={itm}
                            showDelete
                            onRemove={onRemove}
                          />
                        );
                      })}
                  </>
                ) : (
                  <ImageMemo imgFile={uploadFiles} />
                )}
              </>
            )}
          </div>
          {mediaTop && (
            <Textarea
              className="withHolder"
              placeholder={intl.formatMessage({ ...messages.M0000001 })}
              height={150}
              // maxLength={TWEET_TEXT_LIMIT}
              name="content"
              {...props}
            />
          )}
          <div className="textarea-button">
            {!noImage && !noMulitple && (
              <FileUpload
                id="images"
                name="images"
                accept=".jpg,.jpeg,.png"
                multiple
                icon={
                  <IcoFont icon="icofont-image" style={{ fontSize: '1.5em' }} />
                }
                title={intl.formatMessage({ ...messages.image })}
                {...imagesFile}
              />
            )}
            {!noImage && noMulitple && (
              <FileUpload
                id="images"
                name="images"
                accept=".jpg,.jpeg,.png"
                icon={
                  <IcoFont icon="icofont-image" style={{ fontSize: '1.5em' }} />
                }
                title={intl.formatMessage({ ...messages.image })}
                {...imagesFile}
              />
            )}
            {!noGif && (
              <FileUpload
                id="gif"
                name="gif"
                accept=".gif"
                icon={
                  <IcoFont
                    icon="icofont-file-gif"
                    style={{
                      verticalAlign: '1px',
                      fontSize: '1.2em',
                    }}
                  />
                }
                title={intl.formatMessage({ ...messages.gif })}
                {...gifFile}
              />
            )}
            {!noVideo && (
              <FileUpload
                id="video"
                name="video"
                accept=".mp4,.mov"
                icon={
                  <IcoFont
                    icon="icofont-video-cam"
                    style={{
                      verticalAlign: '1px',
                      fontSize: '1.2em',
                    }}
                  />
                }
                title={intl.formatMessage({ ...messages.video })}
                {...videoFile}
              />
            )}
          </div>
        </StyledDiv>
        {!noTextLimit && availableBytes >= 0 && (
          <Text
            text={intl.formatMessage(
              { id: 'M0000084' },
              {
                halfChars: availableBytes,
                fullChars: Math.floor(availableBytes / 2),
              },
            )}
          />
        )}
        {!noTextLimit && availableBytes < 0 && (
          <ErrorFormatted
            {...{
              list: [
                {
                  errorCode: 'ERROR0028',
                  formatIntl: {
                    id: 'ERROR0028',
                    values: {
                      name: intl.formatMessage({ ...messages.campaignContent }),
                      max: TWEET_TEXT_LIMIT,
                    },
                  },
                },
              ],
              touched: true,
              invalid: true,
            }}
          />
        )}
        {/* <ErrorFormatted {...content.error} />
        <ErrorFormatted {...imagesFile.error} /> */}
        {uploadError && <ErrorFormatted {...uploadError} />}
      </div>
    </>
  );
}

PostTweet.propTypes = {
  imagesFile: PropTypes.any,
  gifFile: PropTypes.any,
  videoFile: PropTypes.any,
  uploadFiles: PropTypes.array,
  fileType: PropTypes.string,
  uploadError: PropTypes.any,
  value: PropTypes.any,
  onRemove: PropTypes.func,
  intl: intlShape,
  noTextLimit: PropTypes.bool,
  noImage: PropTypes.bool,
  noGif: PropTypes.bool,
  noVideo: PropTypes.bool,
  noBorder: PropTypes.bool,
  noMulitple: PropTypes.bool,
  showDelete: PropTypes.bool,
  availableBytes: PropTypes.number,
  mediaTop: PropTypes.any,
  // imagesFile: PropTypes.any,
  // state: PropTypes.any,
  // setState: PropTypes.any,
  // processImg: PropTypes.func,
};

PostTweet.defaultPropTypes = {
  noTextLimit: false,
  noImage: false,
  noGif: false,
  noVideo: false,
  availableBytes: TWEET_TEXT_LIMIT,
};

export default (memo, injectIntl)(PostTweet);
