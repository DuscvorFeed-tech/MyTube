/**
 *
 * ProgressBar
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { StyledProgressBar, StyledProgress } from './StyledProgressBar';

function ProgressBar(props) {
  const { value, primary, tertiary } = props;
  return (
    <StyledProgressBar className="progress">
      <StyledProgress
        className="progress-bar progress-bar-animated"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin="0"
        aria-valuemax="100"
        value={value}
        primary={primary}
        tertiary={tertiary}
      />
    </StyledProgressBar>
  );
}

ProgressBar.propTypes = {
  value: PropTypes.number,
  primary: PropTypes.bool,
  tertiary: PropTypes.bool,
};

export default memo(ProgressBar);
