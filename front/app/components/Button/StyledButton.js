/* eslint-disable indent */
import styled, { css } from 'styled-components';

const StyledButton = styled.button`
  display: inline-block;
  font-weight: 600;
  width: 100%;
  padding: 0.5rem 0.3rem;
  background-color: ${props =>
    props.bgColor ? props.bgColor : props.theme.primary};
  color: ${props => (props.color ? props.color : props.theme.light)};
  box-shadow: none;
  border: 0;
  border-radius: 0.3rem;
  outline: 0;
  text-transform: uppercase;

  &:hover {
    background-color: ${props =>
      props.bgColor
        ? // eslint-disable-next-line no-bitwise
          (props.bgColor & 0x7f7f7f) << 1
        : props.theme.primaryDark};
  }

  ${props =>
    props.bgColor &&
    css`
      text-shadow: 1px 1px 2px #000000;
      box-shadow: 1px 1px 2px #000000;
    `}

  :disabled {
    pointer-events: none;
    opacity: 0.5;
  }
  ${props =>
    props.width === 'icon' &&
    css`
      width: 40px;
    `};
  ${props =>
    props.width === 'sm' &&
    css`
      width: 120px;
    `};
  ${props =>
    props.width === 'md' &&
    css`
      width: 200px;
    `};

  ${props =>
    props.secondary &&
    css`
      background-color: ${x => x.theme.secondary};

      &:hover {
        background-color: ${x => x.theme.secondaryDark};
      }
    `};

  ${props =>
    props.tertiary &&
    css`
      background-color: ${x => x.theme.tertiary};

      &:hover {
        background-color: ${x => x.theme.tertiary};
        opacity: 0.5;
      }
    `};

  ${props =>
    props.red &&
    css`
      background-color: ${x => x.theme.red};

      &:hover {
        background-color: ${x => x.theme.darkRed};
        opacity: 0.5;
      }
    `};

  ${props =>
    props.tertiaryInverted &&
    css`
      background-color: ${x => x.theme.light};
      border: 1px solid #d4d4d4;
      color: ${x => x.theme.tertiary};

      &:hover {
        background-color: ${x => x.theme.light};
        opacity: 0.7;
      }
    `};

  ${props =>
    props.small &&
    css`
      padding: 0.2rem 0.1rem;
      font-size: ${x => x.theme.fontSize.sm};
      line-height: 1.9;
    `};

  ${props =>
    props.icon &&
    css`
      background: ${x => x.theme.light};
      color: ${x => (x.color ? x.color : x.theme.primary)};
      width: auto;
      padding: inherit;

      :before {
        content: '${x => `\\${x.icon}`}';
        font-family: 'Icofont';
        font-weight: 400;
        font-variant: normal;
        text-transform: none;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        vertical-align: middle;
      }

      :hover {
        color: ${x => x.theme.primary};
        background-color: transparent;
      }
      :focus {
        outline: 0;
      }

      ${x =>
        x.secondary &&
        css`
          color: ${y => y.theme.secondary};

          &:hover {
            color: ${y => y.theme.secondaryDark};
          }
        `};

      ${x =>
        x.bordered &&
        css`
          border: 1px solid ${y => y.theme.tertiary};
          text-decoration: none !important;
          color: ${y => y.theme.tertiary};
          padding: 0.15em 0.25em;

          &:hover {
            color: ${y => y.theme.secondary};
            border: 1px solid ${y => y.theme.secondary};
          }
        `};  
    `};

  ${props =>
    props.link &&
    css`
      background-color: transparent;
      color: ${x => (x.color ? x.color : x.theme.primary)};
      font-size: ${x => (x.size ? x.size : x.theme.fontSize.sm)};
      font-weight: normal;
      text-transform: unset;
      width: auto;
      padding: 0;

      :hover {
        color: ${x => x.theme.primaryBlur};
        background-color: transparent;
      }
      :focus {
        outline: 0;
      }

      &.underline {
        font-size: ${x => (x.size ? x.size : x.theme.fontSize.md)};
        text-decoration: underline;
        font-weight: 700;
      }

      &.dark {
        color: #5a5971;

        :hover {
          opacity: 0.8;
        }
      }

      &.danger {
        color: #ee5353;
        font-weight: 700;

        :hover {
          opacity: 0.8;
          color: ${x => x.theme.dark};
        }
      }
    `};
`;

export default StyledButton;
