import styled from 'styled-components';

const StyledPager = styled.div`
  .pagination {
    justify-content: flex-end;
  }

  &&& {
    a {
      width: 34px;
    }
  }

  .page-link {
    color: ${x => x.theme.dark};
    padding: 0;
    height: 30px;
    line-height: 30px;
    width: 30px;
    margin-right: 5px;
    text-align: center;
    background: none;
    border: 1px solid ${x => x.theme.gray};
    font-weight: 600;

    &:hover {
      background: ${x => x.theme.primaryDark};
      color: ${x => x.theme.light};
    }

    &:focus {
      box-shadow: none;
    }
  }

  .page-item.active {
    .page-link {
      border-radius: 0;
      background: ${x => x.theme.primaryDark};
      color: #fff;
      border: none;

      &:hover {
        background: ${x => x.theme.primaryDark};
        color: #fff;
      }
    }
  }
  .page-item.disabled .page-link {
    background: transparent;
  }
  .page-item:last-child .page-link {
    border-radius: 0;
  }
`;

export default StyledPager;
