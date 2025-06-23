/**
 *
 * ColorPicker
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import Button from 'components/Button';
// import styled from 'styled-components';
import { PhotoshopPicker } from 'react-color';
import { intlShape, injectIntl } from 'react-intl';
import StyledColorPicker from './StyledColorPicker';
import messages from '../../containers/SettingsPage/Label/AddLabelPage/messages';

function ColorPicker(props) {
  const { value, onAccept, intl } = props;
  const [bg, setBg] = useState(value);
  const [state, setState] = useState(false);

  const handleOnChange = e => {
    setBg(e);
  };

  const handleAccept = () => {
    onAccept(bg.hex);
    setState(!state);
  };

  const handleColorReset = () => {
    setBg(value);
    setState(!state);
  };

  return (
    <StyledColorPicker>
      <Button
        className={state ? 'invisible' : ''}
        bgColor={value}
        onClick={() => {
          setState(!state);
        }}
      >
        {intl.formatMessage(
          { id: 'M0000008' },
          { name: intl.formatMessage(messages.color) },
        )}
      </Button>
      <div className={state ? 'picker' : 'd-none'}>
        <PhotoshopPicker
          color={bg}
          onChangeComplete={handleOnChange}
          onAccept={handleAccept}
          onCancel={handleColorReset}
        />
      </div>
    </StyledColorPicker>
  );
}

ColorPicker.propTypes = {
  value: PropTypes.any,
  onAccept: PropTypes.func,
  intl: intlShape,
};

export default compose(
  injectIntl,
  memo,
)(ColorPicker);
