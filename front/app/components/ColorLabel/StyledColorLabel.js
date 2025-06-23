import styled, { css } from 'styled-components';

const StyledColorLabel = styled.div`
  color: ${props => props.theme.dark};
  font-size: ${props => props.theme.fontSize.md};
  padding: 0.5rem 0.5rem;
  border-radius: 0.2rem;
  display: inline-block;
  vertical-align: sub;

  ${props =>
    props.color &&
    css`
      background-color: ${props.color};
    `};

  ${props =>
    props.color === 'blue' &&
    css`
      background-color: #2f22ef;
    `};

  ${props =>
    props.color === 'pink' &&
    css`
      background-color: #ef22be;
    `};

  ${props =>
    props.color === 'lightOrange' &&
    css`
      background-color: #efb222;
    `};

  ${props =>
    props.color === 'green' &&
    css`
      background-color: #22ef58;
    `};

  ${props =>
    props.color === 'red' &&
    css`
      background-color: #ef2222;
    `};

  ${props =>
    props.color === 'lightBlue' &&
    css`
      background-color: #22dbef;
    `};

  ${props =>
    props.color === 'purple' &&
    css`
      background-color: #7b22ef;
    `};

  ${props =>
    props.color === 'orange' &&
    css`
      background-color: #ef8122;
    `};

  ${props =>
    props.color === 'maroon' &&
    css`
      background-color: #d14545;
    `};

  ${props =>
    props.color === 'lightPurple' &&
    css`
      background-color: #9fa9e7;
    `};
`;

export default StyledColorLabel;
