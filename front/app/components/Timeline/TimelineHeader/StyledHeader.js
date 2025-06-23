import styled from 'styled-components';

const StyledHeader = styled.ul`
  color: ${props => props.theme.quinary};
  padding: 0;
  letter-spacing: 0.5px;

  @media (max-width: 320px) {
    font-size: 1.5rem;
  }
`;

export default StyledHeader;
