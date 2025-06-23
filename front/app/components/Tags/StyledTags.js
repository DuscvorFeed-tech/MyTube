import styled, { keyframes } from 'styled-components';

const flick = keyframes`
0%   {transform: scale(0);}
60%  {transform: scale(1.15);}
100% {transform: scale(1);}
`;

const StyledTags = styled.div`
  display: inline-block;
  position: relative;
  margin: 0 5px;

  label {
    padding: 5px 28px 5px 15px;
    position: relative;
    z-index: 1;
    color: ${props => props.theme.light};
    display: block;
    border-radius: 16px;
    background: ${props => props.theme.primary};
    border: 1px solid ${props => props.theme.primary};
    transition: all 0.08s ease-in;
    font-size: ${props => props.theme.fontSize.sm};
  }

  > input[type='checkbox'] {
    opacity: 0;
    position: absolute;
    z-index: 300;
    cursor: pointer;
    left: 0;
    width: 100%;
    height: 100%;

    &:hover + label {
      opacity: 0.7;
    }
  }

  button {
    position: absolute;
    z-index: 2;
    right: 7px;
    top: 9px;
    color: ${props => props.theme.primary};
    line-height: 0.95;
    border-radius: 1rem;
    height: 14px;
    width: 14px;
    opacity: 0.5;

    :hover {
      color: ${props => props.theme.primary};
      background-color: ${props => props.theme.light};
      opacity: 1;
    }
  }

  .fa-check {
    display: none;
    top: 8px;
    right: 10px;
    transition: all 0.08s ease-in;
  }

  input[type='checkbox']:checked + label {
    background: @red;
    animation: ${flick} 0.08s;
  }
  input[type='checkbox']:checked ~ .fa-plus {
    display: none;
  }
  input[type='checkbox']:checked ~ .fa-check {
    animation: ${flick} 0.08s;
    display: block;
  }
`;

export default StyledTags;
