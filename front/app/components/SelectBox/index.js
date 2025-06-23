/**
 *
 * SelectBox
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icofont from 'react-icofont';
// import Coin from 'components/Cryptoicons';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

const StyledSelect = styled.div`
  position: relative;
  height: 42px;
`;

function SelectBox(props) {
  const { children, placeholder } = props;
  return (
    <StyledSelect>
      <form id="app-cover">
        <div id="select-box">
          <input type="checkbox" id="options-view-button" />
          <div id="select-button">
            <div id="selected-value">
              <span>{placeholder}</span>
            </div>
            <div id="selector">
              <Icofont icon="icofont-rounded-down" />
            </div>
          </div>
          {Children.toArray(children)}
        </div>
      </form>
    </StyledSelect>
  );
}

SelectBox.propTypes = {
  children: PropTypes.node,
  placeholder: PropTypes.string,
};

export default memo(SelectBox);
