/**
 *
 * MiniCard
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import StyledMiniCard from './StyledMiniCard';

function MiniCard(props) {
  const { className, title, desc, bgColor } = props;
  return (
    <StyledMiniCard className={className} bgColor={bgColor}>
      <h5>{title}</h5>
      <p>{desc}</p>
    </StyledMiniCard>
  );
}

MiniCard.propTypes = {
  className: PropTypes.string,
  bgColor: PropTypes.string,
  title: PropTypes.string,
  desc: PropTypes.string,
};

export default memo(MiniCard);
