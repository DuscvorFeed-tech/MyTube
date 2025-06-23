/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import reactCSS from 'reactcss';
import PropTypes from 'prop-types';

export const PhotoshopButton = ({ onClick, label, children, active }) => {
  const styles = reactCSS(
    {
      default: {
        button: {
          backgroundImage: 'linear-gradient(-180deg, #FFFFFF 0%, #E6E6E6 100%)',
          border: '1px solid #878787',
          borderRadius: '2px',
          height: '20px',
          boxShadow: '0 1px 0 0 #EAEAEA',
          fontSize: '14px',
          color: '#000',
          lineHeight: '20px',
          textAlign: 'center',
          marginBottom: '10px',
          cursor: 'pointer',
          textTransform: 'uppercase',
        },
      },
      active: {
        button: {
          boxShadow: '0 0 0 1px #878787',
        },
      },
    },
    { active },
  );

  return (
    <div style={styles.button} onClick={onClick}>
      {label || children}
    </div>
  );
};

PhotoshopButton.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string,
  children: PropTypes.node,
  active: PropTypes.any,
};

export default PhotoshopButton;
