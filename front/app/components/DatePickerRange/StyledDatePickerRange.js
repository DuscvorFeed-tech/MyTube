import styled, { css } from 'styled-components';

const StyledDatePicker = styled.div`
  display: inline-block;
  width: 100%;
  color: ${props => props.theme.quarter};
  border: 1px solid transparent;
  border-radius: 0;
  position: relative;
  height: 33px;

  &:after {
    content: '\\ec45';
    font-family: Icofont, sans-serif;
    position: absolute;
    top: 8px;
    right: 8px;
  }

  input {
    display: inline-block;
    width: 100%;
    background-color: ${props => props.theme.light};
    color: ${props => props.theme.dark};
    border: 1px solid ${props => props.theme.primary};
    font-size: ${props => props.theme.fontSize.lg};
    border-radius: 0;

    &:focus {
      border: 1px solid ${props => props.theme.primaryDark};
    }

    &::placeholder {
      color: ${props => props.theme.grayDark};
    }
  }

  span.bp3-popover-target {
    width: 100%;
  }

  .bp3-input,
  .bp3-input:focus,
  .bp3-input.bp3-active,
  .bp3-input-group.bp3-intent-danger .bp3-input {
    box-shadow: none !important;
    background: ${props => props.theme.gray};
    border: 1px solid transparent;
    font-size: 0.9rem;
    padding: 6px 15px;
    border-radius: 0px;
    cursor: pointer;
  }

  .bp3-control-group > * {
    flex-shrink: 1;
  }

  .bp3-control-group > :last-child > input {
    margin-right: 10px;
  }

  .bp3-datepicker .DayPicker-Day.DayPicker-Day--selected {
    background-color: ${props => props.theme.primary};
  }

  .bp3-datepicker .DayPicker-Day.DayPicker-Day--selected:hover {
    background-color: ${props => props.theme.secondary};
  }

  .bp3-datepicker,
  .bp3-datetimepicker,
  .bp3-datepicker select,
  .bp3-datepicker option,
  .bp3-html-select.bp3-minimal select:active,
  .bp3-select.bp3-minimal select:active,
  .bp3-html-select.bp3-minimal select.bp3-active,
  .bp3-select.bp3-minimal select.bp3-active,
  .bp3-timepicker .bp3-timepicker-input-row,
  .bp3-datepicker .DayPicker-Day:hover,
  .bp3-datepicker .DayPicker-Day:focus,
  .bp3-html-select.bp3-minimal select:hover,
  .bp3-select.bp3-minimal select:hover {
    background: #ffffff;
  }

  .bp3-html-select.bp3-minimal select:hover,
  .bp3-select.bp3-minimal select:hover {
    background: ${props => props.theme.light} !important;
  }

  ${props =>
    props.input &&
    css`
      &:after {
        top: 5px;
        right: 6px;
      }
      .bp3-input,
      .bp3-input:focus,
      .bp3-input.bp3-active,
      .bp3-input-group.bp3-intent-danger .bp3-input {
        border: 1px solid #d4d4d4;
        border-radius: 10px;
        padding: 15px 6px;
        width: 100%;
      }

      .bp3-control-group:not(.bp3-vertical) > * {
        margin-right: 0;
      }

      .bp3-control-group > :first-child {
        margin-right: 10px;
      }
    `};
`;

export default StyledDatePicker;
