/**
 *
 * ListContent
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import StyledListContent from './StyledListContent';

function ListContent(props) {
  const {
    className,
    text,
    red,
    green,
    align,
    children,
    width,
    onClick,
    hasCheckbox,
  } = props;
  return (
    <StyledListContent
      className={className}
      text={text}
      red={red}
      green={green}
      align={align}
      width={width}
      onClick={onClick}
      hasCheckbox={hasCheckbox}
    >
      {Children.toArray(children)}
    </StyledListContent>
  );
}

ListContent.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  width: PropTypes.string,
  align: PropTypes.string,
  children: PropTypes.node,
  red: PropTypes.bool,
  green: PropTypes.bool,
  hasCheckbox: PropTypes.bool,
  onClick: PropTypes.func,
};

export default memo(ListContent);
