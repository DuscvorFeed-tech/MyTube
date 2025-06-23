import styled, { keyframes, css } from 'styled-components';

const animateHide = keyframes`
0% { 
  opacity: 1;
}
100% {
  opacity: 0;
}
`;

const animateShow = keyframes`
0% { 
  opacity: 0;
}
100% {
  opacity: 1;
}
`;

const StyledAlert = styled.div`
  margin-bottom: 0;
  animation: ${animateShow} 0.5s ease-in;
  transition: 0.3s all ease;

  &.hide {
    transition: 0.3s all ease;
    animation: ${animateHide} 0.5s ease-out;
    height: 0;
    margin-bottom: 0 !important;
    padding: 0;
    visibility: hidden;
  }

  ${props =>
    props.noclose &&
    css`
      button.close {
        display: none;
      }
    `};

  ${props =>
    props.networkErrorLog &&
    css`
      z-index: 5;
      button.close {
        position: absolute;
        top: 22px;
        right: 20px;
      }
    `};
`;

export default StyledAlert;
