import styled, { css } from 'styled-components';
import check from 'assets/images/icons/check.png';

const StyledCheckbox = styled.input`
  display: inline-block;
  height: 20px;
  width: 20px;
  border: 1px solid #D4D4D4;
  background: ${props => props.theme.gray};
  color: ${props => props.theme.dark};
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:checked {
    background: ${props => props.theme.gray}
      url('${check}')
      no-repeat center;
    background-size: 85%;
  }

  &:focus {
    border: 1px solid ${props => props.theme.primary};
  }

  ${props =>
    props.disabled &&
    css`
      opacity: 0.5;
    `};
`;

export default StyledCheckbox;
