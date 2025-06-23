/**
 *
 * ListContent
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import StyledListDetail from './StyledListDetail';

function ListContentDetail(props) {
  const { id, className, align, children, width, onClick } = props;
  return (
    <StyledListDetail
      className={className}
      id={id}
      align={align}
      width={width}
      onClick={onClick}
    >
      {Children.toArray(children)}
    </StyledListDetail>
  );
}

ListContentDetail.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  width: PropTypes.string,
  align: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

export default memo(ListContentDetail);
