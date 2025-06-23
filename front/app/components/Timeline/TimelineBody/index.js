/**
 *
 * TimelineBody
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';
import StyledBody from './StyledBody';

function TimelineBody(props) {
  const { className, children } = props;
  return (
    <StyledBody className={className}>{Children.toArray(children)}</StyledBody>
  );
}

TimelineBody.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default memo(TimelineBody);
