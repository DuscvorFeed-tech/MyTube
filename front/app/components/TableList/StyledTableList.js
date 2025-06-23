import styled, { css } from 'styled-components';

const StyledTableList = styled.ul`
  padding-inline-start: 0px;
  list-style-type: none;
  display: table;
  table-layout: fixed;
  width: 100%;
  margin-bottom: 0;
  text-align: ${x => (x.align ? x.align : 'right')};
  border-bottom: 1px dashed #f0f3ff;

  &.cursorPointer:hover {
    background: ${props => props.theme.gray};
  }

  &.active--detail {
    border-bottom: none;
  }

  &.borderLess {
    border-bottom: 0;
    text-align: left !important;
  }

  .toggleIcon {
    &.active--detail {
      :before {
        content: '\\ea67';
      }
    }
  }

  ${props =>
    props.header &&
    css`
      text-align: ${x => (x.align ? x.align : 'center')};
      color: ${x => x.theme.secondaryDark};
      background: ${x => (x.bgGray ? x.theme.gray : 'transparent')};
      text-transform: uppercase;
      font-weight: 700;
      font-size: ${x => x.theme.fontSize.sm};
    `};
`;

export default StyledTableList;
