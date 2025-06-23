import styled from 'styled-components';

const StyledTable = styled.table`
  thead {
    background: ${x => x.theme.gray};
  }
  tr {
    border-bottom: 1px solid ${x => x.theme.gray};
  }
`;

export default StyledTable;
