/**
 *
 * RadioButton
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import Text from 'components/Text';
import {
  StyledRadioGroup,
  StyledRadioButton,
  StyledLabel,
  StyledSubLabel,
} from './StyledRadioButton';

function RadioButton(props) {
  const {
    id,
    name,
    className,
    value,
    onClick,
    onChange,
    disabled,
    text,
    src,
    withImg,
    checked,
    subLabel,
  } = props;
  return (
    <StyledRadioGroup>
      <StyledRadioButton
        type="radio"
        id={id}
        name={name}
        className={className}
        value={value}
        onClick={onClick}
        onChange={onChange}
        disabled={disabled}
        text={text}
        src={src}
        withImg={withImg}
        checked={checked}
        subLabel={subLabel}
      />
      <StyledLabel htmlFor={id}>
        {withImg ? <img src={src} alt={id} width="100px" /> : `${text}`}
      </StyledLabel>
      {subLabel && (
        <StyledSubLabel className="mb-3">
          <Text text={subLabel} />
        </StyledSubLabel>
      )}
    </StyledRadioGroup>
  );
}

RadioButton.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  text: PropTypes.string,
  src: PropTypes.string,
  withImg: PropTypes.bool,
  checked: PropTypes.bool,
  subLabel: PropTypes.string,
};

export default memo(RadioButton);
