/**
 *
 * TabFlow
 *
 */

import React, { Children, memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.ul`
  overflow: hidden;
  text-align: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  counter-reset: step;
  position: relative;
  padding: 0;
  margin-bottom: 0;

  &.equal li {
    flex-grow: 1;
    margin: 0 0.8rem;
  }

  li:last-child {
    margin-right: 0;
  }

  &.bottom {
    bottom: -12px;
  }
`;

/* eslint-disable react/prefer-stateless-function */
function Wrapper(props) {
  const { className, children } = props;
  return (
    <div className="position-relative">
      <Container className={className}>{Children.toArray(children)}</Container>
    </div>
  );
}

Wrapper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default memo(Wrapper);
