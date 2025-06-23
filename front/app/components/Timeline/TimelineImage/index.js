/**
 *
 * TimelineImage
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';
import StyledImage from './StyledImage';

function TimelineImage(props) {
  const { className, children } = props;
  return (
    <StyledImage className={className}>
      {Children.toArray(children)}
    </StyledImage>
  );
}

TimelineImage.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default memo(TimelineImage);
