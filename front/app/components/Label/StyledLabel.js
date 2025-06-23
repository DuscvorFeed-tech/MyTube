import styled, { css } from 'styled-components';

const StyledLabel = styled.label`
  color: ${props => props.theme.dark};
  font-size: ${props => props.size && props.size};
  padding: 0.3rem 0.5rem;
  border-radius: 2rem;
  margin-bottom: 0;
  font-weight: 600;

  small {
    color: ${props => props.theme.tertiary};
    font-weight: normal;
    display: block;
  }

  ${props =>
    props.required &&
    css`
      span.main:after {
        content: '*';
        color: #ff0000;
        padding-left: 0.1rem;
      }
    `};

  ${props =>
    props.status === 'success' &&
    css`
      font-size: ${x => x.theme.fontSize.xs};
      background-color: rgba(29, 201, 183, 0.1);
      color: #1dc9b7;
      cursor: text;
      font-weight: 700;
    `};
  ${props =>
    props.status === 'warning' &&
    css`
      font-size: ${x => x.theme.fontSize.xs};
      background-color: rgba(255, 184, 34, 0.1);
      color: #ffb822;
      cursor: text;
      font-weight: 700;
    `};
  ${props =>
    props.status === 'danger' &&
    css`
      font-size: ${x => x.theme.fontSize.xs};
      background-color: rgba(251, 32, 32, 0.1);
      color: #fb8a8a;
      cursor: text;
      font-weight: 700;
    `};
  ${props =>
    props.status === 'info' &&
    css`
      font-size: ${x => x.theme.fontSize.xs};
      background-color: rgba(47, 163, 230, 0.1);
      color: #17a2b8;
      cursor: text;
      font-weight: 700;
    `};
`;

export default StyledLabel;
