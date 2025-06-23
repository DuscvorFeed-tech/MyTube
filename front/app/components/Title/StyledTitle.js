import styled, { css } from 'styled-components';

const StyledTitle = styled.div`
  font-size: ${props => (props.size ? props.size : props.theme.fontSize.sm)};
  background: ${props =>
    props.background ? props.background : props.theme.tertiaryLight};
  color: ${props => (props.color ? props.color : props.theme.secondary)};
  font-weight: 600;
  text-align: ${props => (props.align ? props.align : 'left')};
  padding: 0.5rem 1.25rem;
  line-height: 1;
  text-transform: uppercase;

  ${props =>
    props.main &&
    css`
      font-size: ${x => (x.size ? x.size : '2rem')};
      color: ${x => (x.color ? x.color : x.theme.primary)};
      background: transparent;

      > div {
        flex-direction: column-reverse;
        > div {
          flex-direction: column;
        }
      }
    `};

  ${props =>
    props.noTextTransform &&
    css`
      text-transform: none;
    `};
`;

export default StyledTitle;
