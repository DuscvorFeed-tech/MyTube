import styled from 'styled-components';
import Table from 'components/Table';

const CustomTable = styled(Table)`
  tr td > div {
    width: 125px;
    margin: auto;
  }
  tr td:nth-child(1) > label {
    word-break: break-word;
    width: 75px;
  }
  tr td:nth-child(2) > div {
    width: 230px;
  }
  .time {
    font-weight: 600;
    span {
      display: block;
      font-weight: normal;
      font-size: ${props => props.theme.fontSize.sm};
      margin-top: 2px;
    }
  }

  &.summary {
    thead tr > td > label {
      word-break: break-word;
    }
    tr td > div {
      width: max-content;
      white-space: nowrap;
      text-align: center;
      min-width: 40px;
    }
    tr td:nth-child(1) > label {
      word-break: break-word;
      width: 75px;
    }
    tr td:nth-child(2) > div {
      width: 140px;
    }
  }
`;

export default CustomTable;
