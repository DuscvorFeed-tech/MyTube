/* eslint-disable prettier/prettier */
/**
 *
 * OrderByAlphabet
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

function OrderByAlphabet({ activeIcon, onClick }) {
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

      {/* a-z sorting ↑ */}
      {activeIcon === 1 && (
        <Button link onClick={() => isClickable && onClick({sort: 'desc', type: 1, activeIcon: 2})}>
          <svg width="1.2em" height="1.4em" viewBox="0 0 16 16" className="bi bi-sort-alpha-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 14a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-1 0v11a.5.5 0 0 0 .5.5z"/>
            <path fillRule="evenodd" d="M6.354 4.854a.5.5 0 0 0 0-.708l-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L4 3.207l1.646 1.647a.5.5 0 0 0 .708 0z"/>
            <path d="M9.664 7l.418-1.371h1.781L12.281 7h1.121l-1.78-5.332h-1.235L8.597 7h1.067zM11 2.687l.652 2.157h-1.351l.652-2.157H11zM9.027 14h3.934v-.867h-2.645v-.055l2.567-3.719v-.691H9.098v.867h2.507v.055l-2.578 3.719V14z"/>
          </svg>
        </Button>
      )}

      {/* z-a sorting ↓ */}
      {activeIcon === 2 && (
        <Button link onClick={() => isClickable && onClick({sort: 'asc', type: 2, activeIcon: 1})}>
          <svg width="1.2em" height="1.4em" viewBox="0 0 16 16" className="bi bi-sort-alpha-down-alt" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11A.5.5 0 0 1 4 2z"/>
            <path fillRule="evenodd" d="M6.354 11.146a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L4 12.793l1.646-1.647a.5.5 0 0 1 .708 0z"/>
            <path d="M9.027 7h3.934v-.867h-2.645v-.055l2.567-3.719v-.691H9.098v.867h2.507v.055L9.027 6.309V7zm.637 7l.418-1.371h1.781L12.281 14h1.121l-1.78-5.332h-1.235L8.597 14h1.067zM11 9.687l.652 2.157h-1.351l.652-2.156H11z"/>
          </svg>
        </Button>
      )}
    </>
  );
}

OrderByAlphabet.propTypes = {
  activeIcon: PropTypes.number,
  onClick: PropTypes.func,
};

export default memo(OrderByAlphabet);
