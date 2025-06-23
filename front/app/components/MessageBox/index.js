/**
 *
 * MessageBox
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ErrorFormatted from 'components/ErrorFormatted';
import IcoFont from 'react-icofont';
import StyledMessageBox from './StyledMessageBox';

function MessageBox(props) {
  const { showDelete, onRemove, invalid, list } = props;
  const RemoveIcon = () => (
    <IcoFont
      icon="icofont-close-line-circled"
      onClick={() => onRemove()}
      style={{
        fontSize: '1.8em',
        color: '#f15050',
        borderRadius: '50%',
        position: 'absolute',
        zIndex: '1',
        cursor: 'pointer',
        top: '0px',
        right: '50px',
      }}
    />
  );

  return (
    <StyledMessageBox className="row image-container">
      <ErrorFormatted invalid={invalid} list={list} />
      <div className="col px-0 pb-1">{showDelete && RemoveIcon(0)}</div>
    </StyledMessageBox>
  );
}

MessageBox.propTypes = {
  invalid: PropTypes.bool,
  onRemove: PropTypes.func,
  showDelete: PropTypes.bool,
  list: PropTypes.array,
};

export default memo(MessageBox);
