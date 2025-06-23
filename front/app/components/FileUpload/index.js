/**
 *
 * FileUpload
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import StyledFileUpload from './StyledFileUpload';

function FileUpload(props) {
  const {
    id,
    name,
    disabled,
    className,
    onClick,
    onChange,
    accept,
    onBlur,
    label,
    multiple,
    icon,
    title,
  } = props;
  return (
    <StyledFileUpload className={className} icon={icon} title={title}>
      {icon}
      {label}
      <input
        type="file"
        id={id}
        name={name}
        disabled={disabled}
        onClick={onClick}
        onChange={onChange}
        accept={accept}
        multiple={multiple}
        onBlur={onBlur}
      />
    </StyledFileUpload>
  );
}

FileUpload.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.any,
  accept: PropTypes.string,
  icon: PropTypes.any,
  multiple: PropTypes.bool,
  onBlur: PropTypes.func,
  title: PropTypes.string,
};

export default memo(FileUpload);
