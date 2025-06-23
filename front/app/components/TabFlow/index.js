/**
 *
 * TabFlow
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TabList = styled.li`
  list-style-type: none;
  font-size: 0.9rem;
  position: relative;
  z-index: 2;
  margin-top: -20px;

  & button {
    cursor: pointer;
    background: none;
    border: none;
    color: ${props => props.theme.tertiary};
    padding: 0;
    vertical-align: -30px;
    margin-right: 2rem;
    font-size: 20px;
    opacity: 0.4;

    &:focus {
      outline: none;
    }

    &:before {
      content: counter(step);
      counter-increment: step;
      width: 45px;
      height: 70px;
      line-height: 70px;
      display: inline-block;
      font-size: 70px;
      margin: 0 auto 10px;
    }

    &:disabled,
    &[disabled] {
      cursor: unset;

      &:before {
        background: transparent;
        color: ${props => props.theme.secondary};
      }
    }

    &.active,
    &.active:before,
    &.done:before {
      background: transparent;
      color: ${props => props.theme.secondary};
      opacity: 1;
    }
  }
  @media (max-width: 767px) {
    font-size: 7px;

    & button {
      &:before {
        width: 25px;
        height: 25px;
        line-height: 21px;
        font-size: 10px;
      }
    }
  }
`;
/* eslint-disable react/prefer-stateless-function */
class TabFlow extends React.Component {
  render() {
    const { id, name, className, onClick, label, disabled } = this.props;
    return (
      <TabList>
        <button
          type="button"
          id={id}
          name={name}
          className={className ? className.toString() : ''}
          onClick={onClick}
          disabled={disabled}
        >
          {label}
        </button>
      </TabList>
    );
  }
}

TabFlow.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.any,
  label: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default TabFlow;
