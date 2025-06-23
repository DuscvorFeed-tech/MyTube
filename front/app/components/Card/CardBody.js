/**
 *
 * CardBody
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledCardBody = styled.div`
  color: ${x => x.theme.dark};
  padding: 1.25rem;
  min-height: ${props => (props.minHeight ? props.minHeight : '68vh')};
`;

function CardBody(props) {
  const { children, minHeight } = props;
  return (
    <StyledCardBody className="body" minHeight={minHeight}>
      {Children.toArray(children)}
    </StyledCardBody>
  );
}

CardBody.propTypes = {
  children: PropTypes.node,
  minHeight: PropTypes.string,
};

export default memo(CardBody);
