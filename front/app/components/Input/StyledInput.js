/* eslint-disable prettier/prettier */
import styled, { css } from 'styled-components';

export const StyledInputWrap = styled.div`
  position: relative;
  width: 100%;
  &.icon-font {
    &:after {
      font-family: 'Icofont', sans-serif;
    }
  }

  &:after {
    content: '${props => props.coin}';
    display: block;
    position: absolute;
    right: 4%;
    top: 27%;
    color: ${props => props.theme.primary80};
  }
`;

export const StyledInput = styled.input`
  display: inline-block;
  width: 100%;
  padding: 6px 15px;
  background: ${props => props.theme.gray};
  border: 1px solid #D4D4D4;
  border-radius: 10px;
  outline: 0;
  transition: all 0.3s ease-in-out;

  &:placeholder {
    color: ${props => props.theme.gray};
    text-indent: ${props => (props.indent ? `${props.indent}px` : '40px')};
    font-weight: normal;
    opacity: 1;
  }

  + label {
    display: inline-block;
    position: absolute;
    top: 8px;
    left: 0;
    bottom: 0px;
    padding: 4px 15px;
    color: ${props => props.theme.primary};
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    text-shadow: 0 1px 0 rgba(19, 74, 70, 0);
    transition: all 0.3s ease-in-out;
    border-radius: 3px;
    background: rgba(122, 184, 147, 0);
    pointer-events: none;
  }

  &:focus,
  &:active {
    text-indent: 0;
    border-color: ${props => props.theme.primary};

    &::placeholder {
      color: #aaa;
      opacity: 1;
    }
    + label {
      color: ${props => props.theme.light};
      text-shadow: 0 1px 0 rgba(19, 74, 70, 0.4);
      background: ${props => props.theme.primary};
      transform: translateY(-38.5px);
      font-weight: normal;
      letter-spacing: 0.5px;
      font-size: 0.65rem;
      line-height: 0.8rem;
      top: 12px;

      ${x => x.text === undefined &&
        css`
          display: none;
        `};

      &:after {
        border-top: 4px solid ${props => props.theme.primary};
      }
    }
  }

  &[type=number]{
    border-radius: 0;
    padding: 3px 5px;
    font-size: 11px;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      opacity: 1 !important;
    }
  }

  ${x =>
    x.primary &&
    css`
      border: 1px solid ${props => props.theme.primary};
    `};

  ${x =>
    x.secondary &&
    css`
      border: 0;
      background: transparent;
    `};
    
  ${x =>
    !x.showBackground &&
    css`
      &[disabled] {
        background: transparent;
        color: ${props => props.theme.secondary};
        font-weight: 600;
        padding: 6px 15px;
        cursor: pointer;
        border: 1px solid transparent;
    }`
};

  ${x =>
    x.showBackground &&
    css`
      &[disabled] {
        color: ${props => props.theme.secondary};
        padding: 6px 15px;
        cursor: pointer;
        border: 1px solid transparent;
    }`
};

`;
