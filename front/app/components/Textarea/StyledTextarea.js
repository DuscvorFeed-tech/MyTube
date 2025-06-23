/* eslint-disable prettier/prettier */
import styled, { css } from 'styled-components';

export const StyledTextarea = styled.textarea`
  display: inline-block;
  width: 100%;
  height: ${props => (props.height ? `${props.height}px` : 'auto')};
  padding: 10px 15px;
  color: ${props => props.theme.secondary};
  background: ${props => props.bgray ? props.theme.gray : props.theme.light};
  border: 0;
  border-radius: 3px;
  outline: 0;
  transition: all 0.3s ease-in-out;
  max-height: ${props => (props.maxHeight ? `${props.maxHeight}px` : '160px')};
  min-height: ${props => (props.minHeight ? `${props.minHeight}px` : '0px')};
  resize: ${props => (props.resize ? props.resize : 'none')};

  &:placeholder {
    color: ${props => props.theme.gray};
    text-indent: ${props => (props.indent ? `${props.indent}px` : '40px')};
    font-weight: normal;
    opacity: 1;
  }

  &.withHolder {
    padding: 5px;
    margin: 5px 0;
  }

  &[disabled] {
    readonly: readonly;
  }
  ${x =>
    !x.showBackground &&
    css`
      &[disabled] {
        background: transparent;
        color: ${props => props.theme.secondary};
        font-weight: 600;
        padding: 6px 15px;
        cursor: pointer;
        border: 1px solid transparent;
    }`
}
  
`;
