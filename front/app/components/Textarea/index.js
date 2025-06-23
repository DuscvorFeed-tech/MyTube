/**
 *
 * Textarea
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { StyledTextarea } from './StyledTextarea';

function Textarea(props) {
  const {
    className,
    placeholder,
    name,
    rows,
    cols,
    disabled,
    onChange,
    maxLength,
    height,
    onBlur,
    value,
    maxHeight,
    minHeight,
    resize,
    bgray,
  } = props;
  return (
    <StyledTextarea
      className={className}
      placeholder={placeholder}
      name={name}
      rows={rows}
      cols={cols}
      maxLength={maxLength}
      disabled={disabled}
      onChange={onChange}
      height={height}
      onBlur={onBlur}
      value={value}
      maxHeight={maxHeight}
      minHeight={minHeight}
      resize={resize}
      bgray={bgray}
    />
  );
}

Textarea.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  cols: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxLength: PropTypes.number,
  disabled: PropTypes.bool,
  height: PropTypes.number,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxHeight: PropTypes.number,
  minHeight: PropTypes.number,
  resize: PropTypes.string,
  bgray: PropTypes.bool,
};

export default memo(Textarea);
