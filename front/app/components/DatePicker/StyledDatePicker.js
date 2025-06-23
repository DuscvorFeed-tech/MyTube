import styled from 'styled-components';

const StyledDatePicker = styled.div`
  display: inline-block;
  width: 100%;
  border: 1px solid transparent;
  border-radius: 0;
  position: relative;

  &:after {
    content: '\\ec45';
    font-family: Icofont, sans-serif;
    position: absolute;
    top: 7px;
    right: 10px;
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
    border: 1px solid #d4d4d4;
    font-size: 1rem;
    padding: 15px 15px;
    border-radius: 10px;
    cursor: pointer;

    &:focus-within {
      border-color: ${props => props.theme.primary};
    }
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
`;

export default StyledDatePicker;
