/**
 *
 * Text
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const StyledText = styled.div`
  display: inline-block;
  text-align: ${props => props.align};
  color: ${props => props.color};
  font-size: ${props => props.size};
  white-space: pre-line;

  ${props =>
    props.link &&
    css`
      cursor: pointer;
      color: ${x => x.theme.primaryBlur};
    `};
  ${props =>
    props.title &&
    css`
      text-transform: uppercase;
      font-weight: bold;
    `};
  ${props =>
    props.noTextTransform &&
    css`
      text-transform: none !important;
    `};
`;

function Text(props) {
  const {
    className,
    text,
    align,
    color,
    size,
    onClick,
    link,
    title,
    noTextTransform,
  } = props;
  return (
    <StyledText
      className={className}
      text={text}
      align={align}
      color={color}
      size={size}
      onClick={onClick}
      link={link}
      title={title}
      noTextTransform={noTextTransform}
    >
      {text}
    </StyledText>
  );
}

Text.propTypes = {
  className: PropTypes.string,
  text: PropTypes.any,
  align: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
  link: PropTypes.bool,
  title: PropTypes.bool,
  noTextTransform: PropTypes.bool,
};

export default Text;
