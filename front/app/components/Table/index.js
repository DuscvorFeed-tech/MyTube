/**
 *
 * Table
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';
import StyledTable from './StyledTable';

function Table(props) {
  const { children, className, isResponsive } = props;
  return (
    <div
      className={isResponsive && 'table-responsive'}
      isResponsive={isResponsive}
    >
      <StyledTable className={`table ${className}`}>
        {Children.toArray(children)}
      </StyledTable>
    </div>
  );
}

Table.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isResponsive: PropTypes.bool,
};

export default memo(Table);
