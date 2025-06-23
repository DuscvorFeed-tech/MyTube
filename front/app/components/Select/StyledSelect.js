/* eslint-disable prettier/prettier */
import styled, { css } from 'styled-components';
import selectIcon from 'assets/images/icons/ico-select.png';

const StyledSelect = styled.select`
width: 100%;
padding: 6px 25px 6px 15px;
border-radius: 10px;
outline: 0;
border: 1px solid #D4D4D4;
background: ${x => x.theme.gray} url('${selectIcon}') no-repeat right center;
background-size: 11px;
background-position: 95% 50%;
overflow: hidden;
white-space: nowrap;
appearance: none;

&.border-0 {
  border: 0;
  background-color: ${props => props.theme.light};
}

&.ml-3x {
  margin-left: 3px;
}

&:focus {
  outline: none;
  border-color: ${props => props.theme.primary};

}

  ${x =>
    x.bordered &&
    css`
      padding: 6px 25px 6px 15px;
      border-radius: 10px;
      border: 1px solid #d4d4d4;
    `};

    ${x =>
    x.borderRadius &&
      css`
        padding: 6px 25px 6px 15px;
        border-radius: 0;
        border: 1px solid #d4d4d4;
      `};

      
${x =>
    !x.showBackground &&
  css`
    &:disabled {
      background: transparent;
      font-weight: 600;
      padding: 0rem;
      border: 1px;
      cursor: default;
    }
  `};

${x =>
    x.showBackground &&
  css`
    &:disabled {
      border: none;
      cursor: default;
      color: rgb(0, 0, 0);
    }
  `};

${x =>
    x.secondaryColor &&
    css`
    &[disabled] {
      color: ${props => props.theme.secondary};
    }`
};

${x =>
    x.lightFontWeight &&
  css`
    &:disabled {
      font-weight: 500;
      color: #645959;
    }
`};

`;

export default StyledSelect;
