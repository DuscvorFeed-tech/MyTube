/**
 *
 * CardHeader
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledCardHeader = styled.div`
  background: ${x => x.theme.tertiaryLight};
  color: ${x => x.theme.dark};
  padding: 0.5rem 1.25rem;
  font-weight: 600;
  border-bottom: 1px solid ${x => x.theme.gray};
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 50.59px;
  text-transform: uppercase;

  > div {
    width: 100%;
  }

  > button {
    position: relative;
    top: -6px;
  }

  .subtitle {
    font-size: ${x => x.theme.fontSize.sm};
  }
`;

function CardHeader(props) {
  const { cardHeader, children, className } = props;
  return (
    <StyledCardHeader className={className} cardHeader={cardHeader}>
      {Children.toArray(children)}
    </StyledCardHeader>
  );
}

CardHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  cardHeader: PropTypes.bool,
};

export default memo(CardHeader);
