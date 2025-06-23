import styled, { css } from 'styled-components';
// import '../../styles/shared.scss';

const StyledLayout = styled.div`
  .wrapper-main {
  }

  @media (${props => props.theme.mediaQuery.max.lg}) {
    .wrapper-main {
    }
    .sidebar {
    }
  }

  .alert-settings {
    display: flex;
    justify-content: space-between;
    padding: 0.25rem 0.5rem;
    position: fixed;
    width: 100%;
    z-index: 5;
    bottom: -15px;
    border-top: 1px solid ${props => props.theme.dark};
  }

  .alert-networkLogs {
    display: block;
    justify-content: space-between;
    padding: 0.55rem 1.5rem;
    margin: 0 auto;
    position: fixed;
    width: 100%;
    z-index: 5;
    bottom: 0px;
  }

  ${props =>
    props.isFullPage &&
    css`
      .wrapper-main {
        > div {
          width: 100%;
        }
      }
    `};
`;

export default StyledLayout;
