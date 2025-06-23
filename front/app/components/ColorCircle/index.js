/**
 *
 * ColorCircle
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import StyledColorCircle from './StyledColorCircle';

function ColorCirle(props) {
  const { nomargin, color } = props;
  return <StyledColorCircle color={color} nomargin={nomargin} />;
}

ColorCirle.propTypes = {
  color: PropTypes.string,
  nomargin: PropTypes.string,
};

export default memo(ColorCirle);
