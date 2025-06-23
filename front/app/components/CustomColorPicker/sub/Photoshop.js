/**
 *
 * CustomColorPicker
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import reactCSS from 'reactcss';
import merge from 'lodash/merge';

import { CustomPicker } from 'react-color';
import { Saturation, Hue } from 'react-color/lib/components/common';
import { intlShape } from 'react-intl';
import PhotoshopFields from './PhotoshopFields';
import PhotoshopPointerCircle from './PhotoshopPointerCircle';
import PhotoshopPointer from './PhotoshopPointer';
import PhotoshopButton from './PhotoshopButton';
import PhotoshopPreviews from './PhotoshopPreviews';

// import { FormattedMessage } from 'react-intl';
import messages from '../messages';

function Photoshop(props) {
  const { styles: passedStyles = {}, className = '', intl } = props;
  const styles = reactCSS(
    merge(
      {
        default: {
          picker: {
            background: '#DCDCDC',
            borderRadius: '4px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.25), 0 8px 16px rgba(0,0,0,.15)',
            boxSizing: 'initial',
            width: '513px',
          },
          head: {
            backgroundImage:
              'linear-gradient(-180deg, #F0F0F0 0%, #D4D4D4 100%)',
            borderBottom: '1px solid #B1B1B1',
            boxShadow:
              'inset 0 1px 0 0 rgba(255,255,255,.2), inset 0 -1px 0 0 rgba(0,0,0,.02)',
            height: '23px',
            lineHeight: '24px',
            borderRadius: '4px 4px 0 0',
            fontSize: '13px',
            color: '#4D4D4D',
            textAlign: 'center',
          },
          body: {
            padding: '15px 15px 0',
            display: 'flex',
          },
          saturation: {
            width: '256px',
            height: '256px',
            position: 'relative',
            border: '2px solid #B3B3B3',
            borderBottom: '2px solid #F0F0F0',
            overflow: 'hidden',
          },
          hue: {
            position: 'relative',
            height: '256px',
            width: '19px',
            marginLeft: '10px',
            border: '2px solid #B3B3B3',
            borderBottom: '2px solid #F0F0F0',
          },
          controls: {
            width: '180px',
            marginLeft: '10px',
          },
          top: {
            display: 'flex',
          },
          previews: {
            width: '60px',
          },
          actions: {
            flex: '1',
            marginLeft: '20px',
          },
        },
      },
      passedStyles,
    ),
  );

  return (
    <div style={styles.picker} className={`photoshop-picker ${className}`}>
      <div style={styles.head}>{intl.formatMessage(messages.colorPicker)}</div>

      <div style={styles.body} className="flexbox-fix">
        <div style={styles.saturation}>
          <Saturation
            hsl={props.hsl}
            hsv={props.hsv}
            pointer={PhotoshopPointerCircle}
            onChange={props.onChange}
          />
        </div>
        <div style={styles.hue}>
          <Hue
            direction="vertical"
            hsl={props.hsl}
            pointer={PhotoshopPointer}
            onChange={props.onChange}
          />
        </div>
        <div style={styles.controls}>
          <div style={styles.top} className="flexbox-fix">
            <div style={styles.previews}>
              <PhotoshopPreviews
                rgb={props.rgb}
                currentColor={props.currentColor}
                intl={intl}
              />
            </div>
            <div style={styles.actions}>
              <PhotoshopButton
                label={intl.formatMessage(messages.ok)}
                onClick={props.onAccept}
                active
              />
              <PhotoshopButton
                label={intl.formatMessage(messages.cancel)}
                onClick={props.onCancel}
              />
              <PhotoshopFields
                onChange={props.onChange}
                rgb={props.rgb}
                hsv={props.hsv}
                hex={props.hex}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Photoshop.propTypes = {
  //   header: PropTypes.string,
  styles: PropTypes.object,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onAccept: PropTypes.func,
  onCancel: PropTypes.func,
  rgb: PropTypes.object,
  hsv: PropTypes.object,
  hsl: PropTypes.object,
  hex: PropTypes.string,
  currentColor: PropTypes.string,
  intl: intlShape,
};

Photoshop.defaultProps = {
  //   header: 'Color Picker',
  styles: {},
};

export default CustomPicker(Photoshop);
