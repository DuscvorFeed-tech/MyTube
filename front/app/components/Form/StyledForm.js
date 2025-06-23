/**
 * A link to a certain page, an anchor tag
 */

import styled from 'styled-components';

const StyledForm = styled.div`
  padding: 0.5rem;

  .title {
    font-weight: 900;
    letter-spacing: 0.002rem;
    text-transform: uppercase;
  }

  .label {
    font-weight: 600;
  }

  .title,
  .label,
  .content {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
`;

export default StyledForm;
