/**
 *
 * Gif
 *
 */

import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import IcoFont from 'react-icofont';

import StyledTweetImage from './StyledTweetImage';
import StyledGifVideo from './StyledGifVideo';

const GifMemo = ({ src, className, width, height, onRemove, showDelete }) => {
  const state = src.url ? src.url : src;
  let isImage;
  try {
    isImage = !(state && state.split('.').pop() === 'mp4');
  } catch (err) {
    isImage = !(state && state.name && state.name.split('.').pop() === 'mp4');
  }

  let realSrc;
  if (src && typeof src === 'string') {
    realSrc = src;
  } else if (src && typeof src === 'object' && src.id === undefined) {
    realSrc = URL.createObjectURL(src);
  } else if (src && typeof src === 'object' && !!src.id) {
    realSrc = src.url;
  } else {
    realSrc = '';
  }

  const tweetGif = useMemo(
    () => (
      <>
        {showDelete && (
          <IcoFont
            icon="icofont-close"
            onClick={() => onRemove()}
            style={{
              fontSize: '1.3em',
              color: '#fff',
              background: 'rgba(0,0,0,0.5)',
              padding: '5px',
              borderRadius: '50%',
              position: 'absolute',
              zIndex: '1',
              cursor: 'pointer',
              top: '5px',
              left: '20px',
            }}
          />
        )}
        {!isImage ? (
          <div className="col item text-center">
            <StyledGifVideo
              src={src}
              className={className}
              title="video"
              height={height}
              width={width}
              autoPlay
              loop
            />
          </div>
        ) : (
          <div className="col item text-center">
            <StyledTweetImage
              src={realSrc}
              className={className}
              title="Gif"
              height={height}
              width={width}
            />
          </div>
        )}
        {
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.77)',
              fontSize: '13px',
              color: 'white',
              padding: '2px',
              borderRadius: '20%',
              width: 'fit-content',
              marginTop: '-20px',
            }}
          >
            GIF
          </div>
        }
      </>
    ),
    [state],
  );
  return tweetGif;
};

function TweetGif(props) {
  return (
    <>
      <GifMemo {...props} />
    </>
  );
}

TweetGif.propTypes = {
  src: PropTypes.any.isRequired,
  className: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  onRemove: PropTypes.func,
  showDelete: PropTypes.bool,
};

export default memo(TweetGif);
