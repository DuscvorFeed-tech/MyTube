/**
 *
 * Label
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';
import IcoFont from 'react-icofont';
import Button from 'components/Button';
import StyledLabel from './StyledLabel';

function Label(props) {
  const {
    children,
    id,
    name,
    htmlFor,
    disabled,
    className,
    status,
    required,
    size,
    subLabel,
    info,
    tooltip,
  } = props;
  return (
    <StyledLabel
      id={id}
      name={name}
      htmlFor={htmlFor}
      disabled={disabled}
      className={className}
      status={status}
      required={required}
      size={size}
      subLabel={subLabel}
      info={info}
      tooltip={tooltip}
    >
      <span className="main">
        {Children.toArray(children)}
        {info && (
          <Button link dataToggle="tooltip" dataPlacement="top" title={tooltip}>
            <IcoFont
              className="cursorPointer active"
              icon="icofont-info-circle"
              style={{
                verticalAlign: '0px',
                lineHeight: '1.8',
                margin: '0 2px',
              }}
            />
          </Button>
        )}
      </span>
      {subLabel && <small>{subLabel}</small>}
    </StyledLabel>
  );
}

Label.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  status: PropTypes.string,
  htmlFor: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  info: PropTypes.bool,
  children: PropTypes.node,
  size: PropTypes.string,
  subLabel: PropTypes.string,
  tooltip: PropTypes.string,
};

export default memo(Label);
