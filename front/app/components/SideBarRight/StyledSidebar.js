import styled from 'styled-components';

const headerHeight = '0px';

export const StyledSidebar = styled.div`
  background: ${props => props.theme.light};
  margin-top: ${headerHeight};
  height: 100vh;
  position: fixed;
  right: ${x => (x.toggle ? '0' : '-100%')};
  padding-top: 10px;
  top: 0;
  z-index: 8;
  display: block;
  width: 330px;
  -webkit-transition: all 0.5s ease;
  -moz-transition: all 0.5s ease;
  -ms-transition: all 0.5s ease;
  -o-transition: all 0.5s ease;
  transition: all 0.5s ease;
  overflow-y: auto;
  -webkit-box-shadow: 1px 0px 8px 0px rgba(150, 144, 144, 1);
  -moz-box-shadow: 1px 0px 8px 0px rgba(150, 144, 144, 1);
  box-shadow: 1px 0px 8px 0px rgba(150, 144, 144, 1);

  .x-btn {
    display: flex;
    justify-content: flex-end;
    padding-right: 1rem;
  }
`;

export const StyledOverlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  z-index: 7;
  background: rgba(0, 0, 0, 0.1);
  -webkit-animation: kt-animate-fade-in 0.3s linear 1;
  animation: kt-animate-fade-in 0.3s linear 1;
`;
