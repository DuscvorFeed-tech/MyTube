/**
 *
 * Select
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';

import StyledSelect from './StyledSelect';

function Select(props) {
  const {
    id,
    disabled,
    className,
    placeholder,
    children,
    value,
    onChange,
    onBlur,
    name,
    defaultValue,
    bordered,
    borderRadius,
    showBackground,
    secondaryColor,
    lightFontWeight,
  } = props;
  return (
    <StyledSelect
      id={id}
      disabled={disabled}
      bordered={bordered}
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      name={name}
      defaultValue={defaultValue}
      borderRadius={borderRadius}
      showBackground={showBackground}
      secondaryColor={secondaryColor}
      lightFontWeight={lightFontWeight}
    >
      {Children.toArray(children)}
    </StyledSelect>
  );
}

Select.propTypes = {
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  bordered: PropTypes.bool,
  borderRadius: PropTypes.bool,
  children: PropTypes.node,
  name: PropTypes.string,
  defaultValue: PropTypes.string,
  showBackground: PropTypes.any,
  secondaryColor: PropTypes.bool,
  lightFontWeight: PropTypes.bool,
};

export default memo(Select);
