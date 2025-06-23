import styled, { css } from 'styled-components';

const StyledLanguageSelector = styled.label`
  width: 100%;
  padding: 6px 20px 6px 0px;
  color: ${props => props.theme.primary};
  border-radius: 20px;
  outline: 0;
  border: 1px solid #d4d4d4;
  background: ${x => x.theme.gray};
  white-space: nowrap;
  margin-bottom: 0;

  @media (${props => props.theme.mediaQuery.max.md}) {
    color: ${props => props.theme.primary};
    border-radius: 10px;
    outline: 0;
    white-space: nowrap;
    margin-bottom: 0;
    width: 10px;
  }

  ${props =>
    props.status === 'info' &&
    css`
      font-size: ${x => x.theme.fontSize.xs};
      color: #17a2b8;
      cursor: text;
      font-weight: 700;
    `};
`;

export default StyledLanguageSelector;
