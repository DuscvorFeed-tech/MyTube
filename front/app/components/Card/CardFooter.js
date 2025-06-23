/**
 *
 * CardBody
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledCardFooter = styled.div`
  color: ${x => x.theme.dark};
  padding: 6px 10px 5px;
  width: 100%;
  min-height: 70px;
  position: relative;
  left: 0;
  bottom: 0;
  text-align: right;
`;

function CardFooter(props) {
  const { children } = props;
  return (
    <StyledCardFooter className="footer">
      {Children.toArray(children)}
    </StyledCardFooter>
  );
}

CardFooter.propTypes = {
  children: PropTypes.node,
};

export default memo(CardFooter);
