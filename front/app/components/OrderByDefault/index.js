/* eslint-disable prettier/prettier */
/**
 *
 * OrderByDefault
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import IcoFont from 'react-icofont';
import Button from 'components/Button';
import { isFunction } from 'lodash';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

function OrderByDefault({ activeIcon, onClick }) {
  const isClickable = isFunction(onClick);
  return (
    <>
      {!activeIcon && (
        <IcoFont
          className="cursorPointer active"
          icon="icofont-sort"
          style={{
            marginLeft: '5px',
            fontSize: '1.1em',
          }}
          onClick={() => isClickable && onClick({sort: 'asc', type: 1, activeIcon: 1})}
        />
      )}

      {/* 1-9 sorting ↑ */}
      {activeIcon === 1 && (
        <Button link onClick={() => isClickable && onClick({sort: 'desc', type: 1, activeIcon: 2})}>
          <svg width="1.2em" height="1.4em" viewBox="0 0 16 16" className="bi bi-sort-up-alt" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M3 14a.5.5 0 0 0 .5-.5v-10a.5.5 0 0 0-1 0v10a.5.5 0 0 0 .5.5z"/>
            <path fillRule="evenodd" d="M5.354 5.854a.5.5 0 0 0 0-.708l-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L3 4.207l1.646 1.647a.5.5 0 0 0 .708 0zM7 6.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 0-1h-3a.5.5 0 0 0-.5.5zm0 3a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 0-1h-5a.5.5 0 0 0-.5.5zm0 3a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5zm0-9a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0-.5.5z"/>
          </svg>
        </Button>
      )}

      {/* 9-1 sorting ↓ */}
      {activeIcon === 2 && (
        <Button link onClick={() => isClickable && onClick({sort: 'asc', type: 2, activeIcon: 1})}>
          <svg width="1.2em" height="1.4em" viewBox="0 0 16 16" className="bi bi-sort-down" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M3 2a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-1 0v-10A.5.5 0 0 1 3 2z"/>
            <path fillRule="evenodd" d="M5.354 10.146a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L3 11.793l1.646-1.647a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 9a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z"/>
          </svg>
        </Button>
      )}
    </>
  );
}

OrderByDefault.propTypes = {
  activeIcon: PropTypes.number,
  onClick: PropTypes.func,
};

export default memo(OrderByDefault);
