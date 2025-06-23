/* eslint-disable react/no-array-index-key */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Text from 'components/Text';
import Button from 'components/Button';
import IcoFont from 'react-icofont';

import { injectIntl } from 'react-intl';
import { compose } from 'redux';

import Textarea from 'components/Textarea';
import FileUpload from 'components/FileUpload';
import VideoWrapper from 'components/Video';
import TweetImage from 'components/TweetImage';
import ErrorFormatted from 'components/ErrorFormatted';

import { MediaType, TWEET_TEXT_LIMIT } from 'library/commonValues';

import messages from '../messages';

const ImageMemo = ({ imgFile, onRemove }) => {
  const fileState =
    imgFile && Array.isArray(imgFile)
      ? imgFile.map(i => i.name || i).join('|')
      : imgFile;
  const tweetImage = useMemo(
    () => <TweetImage imgFile={imgFile} showDelete onRemove={onRemove} />,
    [fileState],
  );
  return tweetImage;
};

// const VideoMemo = ({ videoFile, onRemove }) => {
//   const videoState = videoFile;
//   const tweetVideo = useMemo(
//     () => (
//       <>
//         <IcoFont
//           icon="icofont-close"
//           onClick={onRemove}
//           style={{
//             fontSize: '1.3em',
//             color: '#fff',
//             background: 'rgba(0,0,0,0.5)',
//             padding: '5px',
//             borderRadius: '50%',
//             position: 'absolute',
//             zIndex: '1',
//             cursor: 'pointer',
//             top: '5px',
//             left: '20px',
//           }}
//         />
//         <VideoWrapper
//           src={URL.createObjectURL(videoFile)}
//           isAutoPlay
//           showDelete
//           hasControls
//         />
//       </>
//     ),
//     [videoState],
//   );
//   return tweetVideo;
// };

const Tweet = props => {
  const {
    state,
    setState,
    content,
    availableBytes,
    processVidGIF,
    processImg,
    errors,
    intl,
    onSet,
    invalid,
  } = props;
  const { Data, Video, GIF, Photo } = MediaType;
  const minvalid =
    state.image.length === 0 &&
    invalid &&
    state.gif === '' &&
    state.video === '';
  const removeSrc = name => {
    setState(prev => ({
      ...prev,
      [name]: '',
      media: Data,
    }));
  };

  const disableUpload = type => ![Data, type].includes(state.media);

  return (
    <>
      <div className="col-6 px-5 pb-4 ">
        <Text text={intl.formatMessage({ ...messages.yourPost })} />
        <div className="textarea-holder mt-3">
          <Textarea
            className="withHolder"
            placeholder={intl.formatMessage({ ...messages.M0000001 })}
            height={150}
            // maxLength={TWEET_TEXT_LIMIT}
            name="content"
            {...content}
          />
          <div className="col-12">
            {/* VIDEO */}
            {state.media === Video && (
              <>
                <VideoWrapper
                  src={state.video}
                  onRemove={() => removeSrc('video')}
                  showDelete
                />
              </>
            )}
            {/* GIF */}
            {state.media === GIF && (
              <ImageMemo
                imgFile={state.gif}
                showDelete
                onRemove={() => removeSrc('gif')}
              />
            )}
            {/* PHOTO */}
            {state.media === Photo && (
              <ImageMemo
                imgFile={state.image}
                showDelete
                onRemove={processImg}
              />
            )}
          </div>
          <div className="textarea-button">
            {/* PHOTO */}
            <FileUpload
              id="images"
              name="images"
              disabled={state.image.length === 4 || disableUpload(Photo)}
              accept=".jpg,.jpeg,.png"
              multiple
              icon={
                <IcoFont icon="icofont-image" style={{ fontSize: '1.5em' }} />
              }
              onChange={e => {
                processImg(e, true);
                e.target.value = '';
              }}
              title={intl.formatMessage({ ...messages.image })}
            />
            {/* GIF */}
            <FileUpload
              id="gif"
              name="gif"
              disabled={state.gif !== '' || disableUpload(GIF)}
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
              onClick={e => {
                e.target.value = null;
              }}
              onChange={({ target }) => processVidGIF(target, 'gif')}
              title={intl.formatMessage({ ...messages.gif })}
            />
            {/* VIDEO */}
            <FileUpload
              id="video"
              name="video"
              disabled={state.video !== '' || disableUpload(Video)}
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
              onClick={e => {
                e.target.value = null;
              }}
              onChange={({ target }) => processVidGIF(target, 'video', true)}
              title={intl.formatMessage({ ...messages.video })}
            />
          </div>
        </div>
        {availableBytes >= 0 && (
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
        {availableBytes >= 0 && <ErrorFormatted {...content.error} />}
        {errors && <ErrorFormatted invalid list={errors} />}
        {availableBytes < 0 && (
          <ErrorFormatted
            {...{
              list: [
                {
                  errorCode: 'ERROR0028',
                  formatIntl: {
                    id: 'ERROR0028',
                    values: {
                      name: intl.formatMessage({ ...messages.yourPost }),
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
        <div className="mt-3 text-right">
          <Button
            width="sm"
            disabled={minvalid}
            onClick={() => onSet('isPreview', true)}
          >
            {intl.formatMessage({ ...messages.btnNext })}
          </Button>
        </div>
      </div>
    </>
  );
};

Tweet.propTypes = {
  content: PropTypes.any,
  availableBytes: PropTypes.number,
  state: PropTypes.any,
  setState: PropTypes.any,
  errors: PropTypes.any,
  processImg: PropTypes.func,
  processVidGIF: PropTypes.func,
  intl: PropTypes.any,
  onSet: PropTypes.any,
  invalid: PropTypes.any,
};

Tweet.defaultPropTypes = {
  availableBytes: TWEET_TEXT_LIMIT,
};

export default compose(injectIntl)(Tweet);
