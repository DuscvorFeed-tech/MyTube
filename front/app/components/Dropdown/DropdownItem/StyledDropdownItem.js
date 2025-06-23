import styled, { css } from 'styled-components';

export const StyledDropdownItem = styled.button`
  ${props =>
    props.subMenu &&
    props.subMenu.hasSubItem &&
    css`
      &.dropdown-item {
        :after {
          content: '';
          position: absolute;
          left: 197px;
          top: 46px;
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 4px solid #000;
          clear: both;
        }
      }
    `};
  ${sub =>
    sub.subMenu &&
    sub.subMenu.isToggled &&
    css`
      background: #cccccc;
      &.dropdown-item:hover {
        background-color: #cccccc;
      }
    `};
  ${props =>
    props.disabled &&
    css`
      &.dropdown-item {
        opacity: 0.5;
      }
    `};
`;

export const Wrapper = styled.ul`
  overflow: hidden;
  position: relative;
  padding: 0;
  margin-bottom: 0;
  background: ${x => x.theme.secondary};

  div {
    width: 100%;
    button {
      &.dropdown-item:hover {
        background-color: ${x => x.theme.secondary};
      }
    }
  }
`;
