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
// import { PhotoshopPicker } from 'react-color';
import { intlShape, injectIntl } from 'react-intl';
import StyledColorPicker from './StyledColorPicker';
import Picker from './sub/Photoshop';
import messages from '../../containers/SettingsPage/Label/AddLabelPage/messages';

function CustomColorPicker(props) {
  const { value, onAccept, intl } = props;
  const defaultColor = '#000000';
  const [bg, setBg] = useState(defaultColor);
  const [state, setState] = useState(false);

  const handleOnChange = e => {
    setBg(e.hex);
  };

  const handleAccept = () => {
    onAccept(bg);
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
        bgColor={value || defaultColor}
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
        <Picker
          currentColor={value || defaultColor}
          color={bg}
          onChange={handleOnChange}
          onAccept={handleAccept}
          onCancel={handleColorReset}
          intl={intl}
        />
      </div>
    </StyledColorPicker>
  );
}

CustomColorPicker.propTypes = {
  value: PropTypes.any,
  onAccept: PropTypes.func,
  intl: intlShape,
};

export default compose(
  injectIntl,
  memo,
)(CustomColorPicker);
