import styled from 'styled-components';

const StyledBody = styled.div`
  font-size: ${props => props.theme.fontRegular};
  color: ${props => props.theme.senary};
  p,
  ul {
    margin-bottom: 0;
  }
  p + p {
    margin-top: 5px;
  }
`;

export default StyledBody;
