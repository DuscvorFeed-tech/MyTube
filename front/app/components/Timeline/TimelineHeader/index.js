/**
 *
 * TimelineHeader
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';
import StyledHeader from './StyledHeader';

function TimelineHeader(props) {
  const { className, children } = props;
  return (
    <StyledHeader className={className}>
      {Children.toArray(children)}
    </StyledHeader>
  );
}

TimelineHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default memo(TimelineHeader);
