/**
 *
 * Checkbox
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import StyledCheckbox from './StyledCheckbox';

function Checkbox(props) {
  const {
    id,
    value,
    onChange,
    disabled,
    className,
    name,
    checked,
    onBlur,
  } = props;
  return (
    <StyledCheckbox
      type="Checkbox"
      id={id}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      className={className}
      name={name}
      checked={checked}
    />
  );
}

Checkbox.propTypes = {
  id: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  name: PropTypes.string,
};

export default memo(Checkbox);
