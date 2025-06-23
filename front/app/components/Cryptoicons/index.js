/**
 *
 * Cryptoicons
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import * as icon from './icon';
import StyledIcon from './StyledCryptoIcon';

function Cryptoicons(props) {
  const { symbol, size } = props;
  return <StyledIcon src={icon[symbol]} size={size} alt={symbol} />;
}

Cryptoicons.propTypes = {
  symbol: PropTypes.string,
  size: PropTypes.string,
};

export default memo(Cryptoicons);
