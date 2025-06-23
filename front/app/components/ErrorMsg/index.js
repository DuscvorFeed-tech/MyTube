/**
 *
 * ErrorMsg
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';

import StyledErrorMsg from './StyledErrorMsg';

function ErrorMsg(props) {
  const { children, id, className, center } = props;
  return (
    <StyledErrorMsg id={id} className={className} center={center}>
      {Children.toArray(children)}
    </StyledErrorMsg>
  );
}

ErrorMsg.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  center: PropTypes.bool,
};

export default memo(ErrorMsg);
