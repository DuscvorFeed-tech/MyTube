/**
 * A link to a certain page, an anchor tag
 */

import styled from 'styled-components';

const StyledMiniCard = styled.div`
  background: ${props => (props.bgColor ? props.bgColor : '#fff')};
  color: ${props => (props.bgColor ? '#fff' : '#000')};
  padding: 1rem;
  text-align: center;
  text-transform: uppercase;

  h5,
  p {
    margin-bottom: 0;
  }
`;

export default StyledMiniCard;
