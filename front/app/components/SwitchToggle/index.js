/**
 *
 * SwitchToggle
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';
import StyledSwitchToggle from './StyledSwitchToggle';

function SwitchToggle(props) {
  const {
    className,
    children,
    text,
    name,
    value,
    onClick,
    checked,
    trade,
    onChange,
  } = props;
  return (
    <StyledSwitchToggle className={className} text={text} trade={trade}>
      <label className="label" text={text}>
        <div className="toggle">
          <input
            className="toggle-state"
            type="checkbox"
            name={name}
            value={value}
            checked={checked}
            onClick={onClick}
            onChange={onChange}
          />
          <div className="toggle-inner">
            <div className="indicator" />
          </div>
          <div className="active-bg" />
        </div>
        {text}
        {Children.toArray(children)}
      </label>
    </StyledSwitchToggle>
  );
}

SwitchToggle.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  checked: PropTypes.bool,
  trade: PropTypes.bool,
  children: PropTypes.node,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
};

export default memo(SwitchToggle);
