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
  flex-direction: column;
  flex-wrap: wrap;
  position: relative;
  padding: 0;
  margin-bottom: 0;
  width: 170px;
  min-height: auto;
  float: left;
  display: inline-flex;

  li:first-child {
    margin-top: 10px;
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
