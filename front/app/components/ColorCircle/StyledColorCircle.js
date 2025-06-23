import styled, { css } from 'styled-components';

const StyledColorCircle = styled.div`
  background-color: ${props => props.theme.dark};
  font-size: ${props => props.theme.fontSize.md};
  padding: 0.25rem;
  border-radius: 100%;
  display: inline-block;
  margin-right: 0.1rem;
  margin-left: -0.7rem;

  ${props =>
    props.color &&
    css`
      background-color: ${props.color};
    `};

  ${props =>
    props.nomargin &&
    css`
      margin-left: 0rem;
    `};
`;

export default StyledColorCircle;
