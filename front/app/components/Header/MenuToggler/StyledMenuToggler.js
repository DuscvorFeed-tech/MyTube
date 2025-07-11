import styled, { keyframes } from 'styled-components';

const moveUpThenDown = keyframes`
  0% { 
    top:0;
  }
  50% {
    top:-27px;
  }
  100% {
    top:-14px;
  }
`;
const shakeWhileMovingUp = keyframes`
  0% {
    transform: rotateZ(0);
  }
  25% {
    transform:rotateZ(-10deg);
  }
  50% {
    transform:rotateZ(0deg);
  }
  75% {
    transform:rotateZ(10deg);
  }
  100% {
    transform:rotateZ(0);
  }
`;
const shakeWhileMovingDown = keyframes`
  0% {
    transform:rotateZ(0);
  }
  80% {
    transform:rotateZ(3deg);
  }
  90% {
    transform:rotateZ(-3deg);
  }
  100% {
    transform:rotateZ(0);
  }
`;

const StyledMenuToggler = styled.div`
  position: relative;
  top: 15px;
  right: 0;
  left: 0;
  width: 39px;
  transform: translateY(-8%);

  #menu_button {
    width: 39px;
    overflow: hidden;

    #menu_checkbox {
      display: none;
    }

    #menu_label {
      position: relative;
      display: block;
      height: 21px;
      cursor: pointer;

      &:before,
      &:after {
        position: absolute;
        left: 0;
        width: 100%;
        height: 5px;
        background-color: #715091;
        content: '';
        transition: 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55) left;
      }

      &:before {
        top: 0;
      }

      &:after {
        top: 12px;
      }

      #menu_text_bar {
        position: absolute;
        left: 0;
        width: 100%;
        height: 5px;
        background-color: #715091;
        top: 24px;

        &:before {
          content: 'MENU';
          position: absolute;
          top: 5px;
          right: 0;
          left: 0;
          color: #715091;
          font-size: 13px;
          font-weight: bold;
          text-align: center;
          line-height: 13px;
        }
      }
    }

    #menu_checkbox:checked + #menu_label:before {
      left: -39px;
    }

    #menu_checkbox:checked + #menu_label:after {
      left: 39px;
    }

    #menu_checkbox:checked + #menu_label #menu_text_bar:before {
      animation: ${moveUpThenDown} 0.8s ease 0.2s forwards,
        ${shakeWhileMovingUp} 0.8s ease 0.2s forwards,
        ${shakeWhileMovingDown} 0.2s ease 0.8s forwards;
    }
  }
`;

export default StyledMenuToggler;
