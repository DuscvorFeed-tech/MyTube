import styled from 'styled-components';

const StyledIcon = styled.img`
  width: ${props => (props.size ? `${props.size}px` : '18px')};
  vertical-align: -5px;
  margin-right: 5px;
`;

export default StyledIcon;
