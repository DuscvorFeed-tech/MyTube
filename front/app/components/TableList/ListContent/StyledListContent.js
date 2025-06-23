import styled, { css } from 'styled-components';

const getWidth = props => {
  if (props.hasCheckbox) {
    return '50px';
  }
  if (props.width) {
    return `${props.width}%`;
  }
  return 'auto';
};

const StyledListContent = styled.li`
  display: table-cell;
  text-align: ${x => (x.align ? x.align : 'center')};
  padding: 0.5rem;
  width: ${props => getWidth(props)};
  vertical-align: middle;

  :first-child {
    padding-left: 1.25rem;
  }

  :last-child {
    padding-right: 1.25rem;
  }

  &.hidden {
    display: none;
  }

  ${props =>
    props.small &&
    css`
      font-size: 0.65rem;
    `};

  ${props =>
    props.red &&
    css`
      color: ${x => x.theme.red};
      > span {
        color: ${x => x.theme.red80};
      }
    `};

  ${props =>
    props.green &&
    css`
      color: ${x => x.theme.green};
      > span {
        color: ${x => x.theme.green80};
      }
    `};
`;

export default StyledListContent;
