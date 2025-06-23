/**
 *
 * ColorLabel
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import StyledColorLabel from './StyledColorLabel';

function ColorLabel(props) {
  const { id, name, className, color } = props;
  return (
    <StyledColorLabel id={id} name={name} className={className} color={color} />
  );
}

ColorLabel.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
};

export default memo(ColorLabel);
