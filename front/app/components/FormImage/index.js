/**
 *
 * TweetImage
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Img from 'components/Img';
import IcoFont from 'react-icofont';

import StyledImageContainer from './StyledFormImage';

function FormImage(props) {
  const { imgFile, onRemove, showDelete, width, height } = props;
  const RemoveIcon = () => (
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
      {imgFile ? (
        <div className="col px-0 pb-1">
          {showDelete && RemoveIcon(0)}
          <Img src={imgFile} width={width} height={height} />
        </div>
      ) : null}
    </StyledImageContainer>
  );
}

FormImage.propTypes = {
  imgFile: PropTypes.any,
  onRemove: PropTypes.func,
  showDelete: PropTypes.bool,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default memo(FormImage);
