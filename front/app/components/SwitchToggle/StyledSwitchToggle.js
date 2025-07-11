import styled from 'styled-components';

const StyledSwitchToggle = styled.div`
  .label {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    vertical-align: middle;
    margin-bottom: 0;
  }
  .label-text {
    margin-left: 8px;
  }

  .toggle {
    isolation: isolate;
    position: relative;
    height: 21px;
    width: 40px;
    border-radius: 15px;
    background: ${x => (x.trade ? x.theme.secondary : '#d6d6d6')};
    overflow: hidden;
  }

  .toggle-inner {
    z-index: 2;
    position: absolute;
    top: 1px;
    left: 1px;
    height: 19px;
    width: 38px;
    border-radius: 15px;
    overflow: hidden;
  }

  .active-bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 200%;
    background: ${x => (x.trade ? x.theme.secondary : x.theme.primary)};
    transform: translate3d(-100%, 0, 0);
    transition: transform 0.05s linear 0.17s;
  }

  .toggle-state {
    display: none;
  }

  .indicator {
    height: 100%;
    width: 200%;
    background: white;
    border-radius: 13px;
    transform: translate3d(-75%, 0, 0);
    transition: transform 0.35s cubic-bezier(0.85, 0.05, 0.18, 1.35);
  }

  .toggle-state:checked ~ .active-bg {
    transform: translate3d(-50%, 0, 0);
  }

  .toggle-state:checked ~ .toggle-inner .indicator {
    transform: translate3d(25%, 0, 0);
  }
`;

export default StyledSwitchToggle;
