/**
 * A link to a certain page, an anchor tag
 */

import styled from 'styled-components';

const A = styled.a`
  color: ${props => props.theme.secondary};

  &:hover {
    color: ${props => props.theme.secondary};
    text-decoration: none;
    opacity: 0.7;
    cursor: pointer;
  }
`;

export default A;
