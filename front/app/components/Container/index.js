/**
 *
 * Container
 *
 */

import React, { Children } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const StyledContainer = styled.div`
  min-height: calc(100vh - 80px);
  margin: 0 auto;
  width: 100%;

  ${props =>
    props.fitContent &&
    css`
      height: fit-content;
    `};
`;

/* eslint-disable react/prefer-stateless-function */
class Container extends React.Component {
  render() {
    const { className, children, fitContent } = this.props;
    return (
      <React.Fragment>
        <StyledContainer className={className} fitContent={fitContent}>
          {Children.toArray(children)}
        </StyledContainer>
      </React.Fragment>
    );
  }
}

Container.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  fitContent: PropTypes.bool,
};

export default Container;
