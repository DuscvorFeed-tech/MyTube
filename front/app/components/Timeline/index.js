/**
 *
 * Timeline
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';
import StyledUl from './StyledUl';

function Timeline(props) {
  const { className, children } = props;
  return (
    <StyledUl className={className}>{Children.toArray(children)}</StyledUl>
  );
}

Timeline.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default memo(Timeline);
