/**
 *
 * TweetImage
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Img from 'components/Img';
import IcoFont from 'react-icofont';
import { config } from 'utils/config';

import StyledImageContainer from './StyledTweetImage';

function TweetImage(props) {
  const { imgFile, onRemove, showDelete } = props;
  const isFile = imgFile instanceof File;
  const createObjectURL = object => {
    try {
      return URL.createObjectURL(object);
    } catch (e) {
      if (object.url) {
        // If url is defined inside Object for scheduled Image
        // It returns files.
        return `${config.API_URL}/images?filename=${object.url}`;
      }
      return null;
    }
  };
  const isFileArray = x => Array.isArray(x);

  const isFileObject = x => typeof x === 'object';
  // const isFileObject = () =>
  //   isFileArray(imgFile)
  //     ? imgFile.some(value => typeof value === 'object')
  //     : typeof imgFile === 'object';

  const checkFile = file => {
    if (imgFile) {
      if (isFileArray(imgFile) && file) {
        if (isFileObject(file)) {
          return createObjectURL(file);
        }
        if (!file.includes('http') && !file.match(/.(jpg|jpeg|png|gif)$/i)) {
          return `${config.API_URL}/images?filename=${file}`;
        }
        return file;
      }
      if (!isFileArray(imgFile)) {
        if (isFileObject(file)) {
          return createObjectURL(file);
        }
        if (!file.includes('http') && !file.match(/.(jpg|jpeg|png|gif)$/i)) {
          return `${config.API_URL}/images?filename=${file}`;
        }
        return file;
      }
    }
    return false;
  };

  const image1 =
    imgFile && isFileArray(imgFile)
      ? checkFile(imgFile[0])
      : checkFile(imgFile);
  const image2 = imgFile && isFileArray(imgFile) && checkFile(imgFile[1]);
  const image3 = imgFile && isFileArray(imgFile) && checkFile(imgFile[2]);
  const image4 = imgFile && isFileArray(imgFile) && checkFile(imgFile[3]);
  const RemoveIcon = idx => (
    <IcoFont
      icon="icofont-close"
      onClick={() => onRemove(idx)}
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
        left: '5px',
      }}
    />
  );

  return (
    <StyledImageContainer
      className="row image-container"
      imgFile={imgFile}
      showDelete={showDelete}
    >
      {isFile && (
        <div className="col item">
          <div className="col px-0 pb-1">
            {showDelete && RemoveIcon(0)}
            <Img src={URL.createObjectURL(imgFile)} />
          </div>
        </div>
      )}
      {imgFile && imgFile.length > 0 ? (
        <div className="col item">
          <div className="col px-0 pb-1">
            {showDelete && RemoveIcon(0)}
            <Img src={image1} />
          </div>
          {imgFile && imgFile.length >= 3 && (
            <div className="col px-0">
              {showDelete && RemoveIcon(2)}
              <Img src={image3} />
            </div>
          )}
        </div>
      ) : null}
      {imgFile && imgFile.length >= 2 && (
        <div className="col item">
          <div className="col px-0 pb-1">
            {showDelete && RemoveIcon(1)}
            <Img src={image2} />
          </div>
          {imgFile && imgFile.length >= 4 && (
            <div className="col px-0">
              {showDelete && RemoveIcon(3)}
              <Img src={image4} />
            </div>
          )}
        </div>
      )}
    </StyledImageContainer>
  );
}

TweetImage.propTypes = {
  imgFile: PropTypes.any,
  onRemove: PropTypes.func,
  showDelete: PropTypes.bool,
};

export default memo(TweetImage);
