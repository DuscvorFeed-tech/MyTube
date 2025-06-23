/**
 *
 * Input
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { StyledInputWrap, StyledInput } from './StyledInput';

function Input(props) {
  const {
    className,
    id,
    type,
    placeholder,
    height,
    value,
    name,
    onChange,
    onKeyDown,
    onBlur,
    disabled,
    primary,
    text,
    coin,
    indent,
    secondary,
    maxLength,
    showBackground,
  } = props;
  return (
    <StyledInputWrap className={className} coin={coin}>
      <StyledInput
        className={className}
        id={id}
        type={type}
        placeholder={placeholder}
        height={height}
        value={value}
        name={name}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        disabled={disabled}
        primary={primary}
        text={text}
        indent={indent}
        secondary={secondary}
        maxLength={maxLength}
        showBackground={showBackground}
      />
      <label htmlFor={id}>{text}</label>
    </StyledInputWrap>
  );
}

Input.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  height: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  primary: PropTypes.bool,
  text: PropTypes.string,
  coin: PropTypes.string,
  indent: PropTypes.string,
  secondary: PropTypes.bool,
  maxLength: PropTypes.string,
  showBackground: PropTypes.bool,
};

export default memo(Input);
