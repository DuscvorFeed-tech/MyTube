/**
 *
 * Button.js
 *
 * A common button, if you pass it a prop "route" it'll render a link to a react-router route
 * otherwise it'll render a link with an onclick
 */

import React, { Children } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import StyledButton from './StyledButton';

function Button(props) {
  $('[data-toggle="tooltip"]').tooltip();

  const {
    className,
    secondary,
    tertiary,
    tertiaryInverted,
    small,
    icon,
    onClick,
    disabled,
    color,
    size,
    link,
    bordered,
    dataDismiss,
    red,
    width,
    dataToggle,
    dataPlacement,
    title,
    bgColor,
  } = props;
  return (
    <StyledButton
      className={className}
      secondary={secondary}
      tertiary={tertiary}
      tertiaryInverted={tertiaryInverted}
      small={small}
      icon={icon}
      onClick={onClick}
      disabled={disabled}
      color={color}
      size={size}
      link={link}
      bordered={bordered}
      data-dismiss={dataDismiss}
      red={red}
      width={width}
      data-toggle={dataToggle}
      data-placement={dataPlacement}
      title={title}
      bgColor={bgColor}
    >
      {Children.toArray(props.children)}
    </StyledButton>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  secondary: PropTypes.bool,
  tertiary: PropTypes.bool,
  tertiaryInverted: PropTypes.bool,
  bordered: PropTypes.bool,
  small: PropTypes.bool,
  icon: PropTypes.string,
  color: PropTypes.string,
  bgColor: PropTypes.string,
  disabled: PropTypes.bool,
  link: PropTypes.bool,
  size: PropTypes.string,
  dataDismiss: PropTypes.string,
  red: PropTypes.bool,
  width: PropTypes.string,
  dataToggle: PropTypes.string,
  dataPlacement: PropTypes.string,
  title: PropTypes.string,
};

export default Button;
