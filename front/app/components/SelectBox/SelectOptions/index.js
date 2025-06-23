/**
 *
 * SelectOptions
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
// import styled, { css } from 'styled-components';
import Coin from 'components/Cryptoicons';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

// const StyledOptionWrapper = styled.div`

// `;

function SelectOptions(props) {
  const { name, value, icon, label } = props;
  return (
    <React.Fragment>
      <div id="options">
        <div className="option">
          <input className="s-c top" type="radio" name={name} value={value} />
          <input
            className="s-c bottom"
            type="radio"
            name={name}
            value={value}
          />
          <i className="fab">
            <Coin symbol={icon} />
          </i>
          <span className="label">{label}</span>
          {/* <span className="opt-val">{label}</span> */}
        </div>
      </div>
    </React.Fragment>
  );
}

SelectOptions.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  icon: PropTypes.string,
  label: PropTypes.string,
};

export default memo(SelectOptions);
