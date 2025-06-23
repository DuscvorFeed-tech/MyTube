import styled, { css } from 'styled-components';

const StyledFileUpload = styled.label`
  display: inline-block;
  width: 100%;
  padding: 6px 15px;
  color: ${props => props.theme.secondary};
  background: ${props => props.theme.gray};
  border: 1px solid #d4d4d4;
  border-radius: 10px;
  outline: 0;
  transition: all 0.3s ease-in-out;

  ${props =>
    props.icon &&
    css`
      width: auto;
      border-radius: 0;
      background: none;
      border: none;
      margin: 0;
      padding: 0.25rem 0.5rem;
    `};

  & input {
    cursor: inherit;
    display: none;
    filter: alpha(opacity=0);
    min-height: 100%;
    min-width: 100%;
    opacity: 0;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
  }

  &:before {
    font-family: 'Icofont';
    display: block;
    position: relative;
    right: 3px;
    top: 0;
    font-size: 1.2em;
  }

  :hover {
    cursor: pointer;
  }

  &:focus {
    border: 1px solid ${props => props.theme.secondaryDark};
  }
`;

export default StyledFileUpload;
