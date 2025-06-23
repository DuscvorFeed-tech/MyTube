/* eslint-disable prettier/prettier */
/**
 *
 * OrderByNumeric
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

function OrderByNumeric({ activeIcon, onClick }) {
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
          <svg width="1.2em" height="1.4em" viewBox="0 0 16 16" className="bi bi-sort-numeric-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 14a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-1 0v11a.5.5 0 0 0 .5.5z"/>
            <path fillRule="evenodd" d="M6.354 4.854a.5.5 0 0 0 0-.708l-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L4 3.207l1.646 1.647a.5.5 0 0 0 .708 0z"/>
            <path d="M12.438 7V1.668H11.39l-1.262.906v.969l1.21-.86h.052V7h1.046zm-2.84 5.82c.054.621.625 1.278 1.761 1.278 1.422 0 2.145-.98 2.145-2.848 0-2.05-.973-2.688-2.063-2.688-1.125 0-1.972.688-1.972 1.836 0 1.145.808 1.758 1.719 1.758.69 0 1.113-.351 1.261-.742h.059c.031 1.027-.309 1.856-1.133 1.856-.43 0-.715-.227-.773-.45H9.598zm2.757-2.43c0 .637-.43.973-.933.973-.516 0-.934-.34-.934-.98 0-.625.407-1 .926-1 .543 0 .941.375.941 1.008z"/>
          </svg>
        </Button>
      )}

      {/* 9-1 sorting ↓ */}
      {activeIcon === 2 && (
        <Button link onClick={() => isClickable && onClick({sort: 'asc', type: 2, activeIcon: 1})}>
          <svg width="1.2em" height="1.4em" viewBox="0 0 16 16" className="bi bi-sort-numeric-down-alt" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11A.5.5 0 0 1 4 2z"/>
            <path fillRule="evenodd" d="M6.354 11.146a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L4 12.793l1.646-1.647a.5.5 0 0 1 .708 0z"/>
            <path d="M9.598 5.82c.054.621.625 1.278 1.761 1.278 1.422 0 2.145-.98 2.145-2.848 0-2.05-.973-2.688-2.063-2.688-1.125 0-1.972.688-1.972 1.836 0 1.145.808 1.758 1.719 1.758.69 0 1.113-.351 1.261-.742h.059c.031 1.027-.309 1.856-1.133 1.856-.43 0-.715-.227-.773-.45H9.598zm2.757-2.43c0 .637-.43.973-.933.973-.516 0-.934-.34-.934-.98 0-.625.407-1 .926-1 .543 0 .941.375.941 1.008zM12.438 14V8.668H11.39l-1.262.906v.969l1.21-.86h.052V14h1.046z"/>
          </svg>
        </Button>
      )}
    </>
  );
}

OrderByNumeric.propTypes = {
  activeIcon: PropTypes.number,
  onClick: PropTypes.func,
};

export default memo(OrderByNumeric);
