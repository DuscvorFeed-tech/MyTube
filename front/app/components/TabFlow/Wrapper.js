/**
 *
 * TabFlow
 *
 */

import React, { Children } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.ul`
  margin-bottom: 30px;
  overflow: hidden;
  text-align: center;
  color: ${props => props.theme.primary};
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  counter-reset: step;
  position: relative;
  padding: 0;
`;

const Line = styled.div`
  position: absolute;
  width: calc(100% - 26px);
  margin: 0 auto;
  left: 0;
  right: 0;
  top: 15px;
  z-index: 0;
  @media (max-width: 991px) {
    width: 85%;
  }
  @media (max-width: 767px) {
    top: 13px;
  }
`;

/* eslint-disable react/prefer-stateless-function */
class Wrapper extends React.Component {
  render() {
    const { className, children } = this.props;
    return (
      <div className="position-relative">
        <Line />
        <Container className={className}>
          {Children.toArray(children)}
        </Container>
      </div>
    );
  }
}

Wrapper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Wrapper;
