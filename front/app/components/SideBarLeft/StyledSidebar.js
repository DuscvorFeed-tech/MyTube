import styled from 'styled-components';

const headerHeight = '0px';

export const StyledSidebar = styled.div`
  background: ${props => props.theme.light};
  margin-top: ${headerHeight};
  height: 100vh;
  position: fixed;
  left: ${x => (x.showSidebar ? '0' : '-100%')};
  padding-top: 80px;
  display: block;
  overflow-y: auto;
  z-index: 1;
  box-shadow: 1px 0px 8px 0px rgba(150, 144, 144, 1);
  width: 90px;

  .x-btn {
    display: none;
  }

  ul {
    padding-left: 0;
    margin-top: 5px;
    padding-inline-start: 0 !important;

    li {
      list-style: none;
      padding-top: 8px;
      span {
        font-size: 5pt;
      }

      a,
      button {
        display: block;
        text-align: center;
        width: 100%;
        color: ${props => props.theme.grayDark};
        background: transparent;
        border: none;
        padding: 2px 2px;
        font-weight: 500;
        text-decoration: none;
        text-transform: uppercase;
        font-size: inherit;
        outline: 0;

        .encircled {
          margin-right: 0.3rem;
          background: transparent;
          vertical-align: middle;
          border: 3px solid ${props => props.theme.light};
          border-radius: 3rem;
          box-shadow: 0px 3px 6px 0px rgba(150, 144, 144, 1);
        }

        :after {
          content: '\\eaa0';
          font-family: IcoFont, sans-serif;
          position: absolute;
          right: 15px;
        }

        &:hover {
          color: ${props => props.theme.secondary};
          font-weight: 700;
        }

        &.active {
          color: ${props => props.theme.primary};
          font-weight: 700;
          letter-spacing: 1px;

          .encircled {
            color: inherit;
            border: 3px solid ${props => props.theme.primary};
          }
        }

        &.subMenu--active {
          :after {
            content: '\\eaa0';
            font-family: IcoFont, sans-serif;
            transition: all 0.3s ease;
            transform: rotateZ(90deg) /*rtl:ignore*/;
          }
        }
        &.noSubMenu {
          :after {
            content: '';
          }
        }

        > i {
          padding: 3px;
        }
      }
    }

    &.subMenu {
      display: none;
      transition: all 0.3s ease;
      li {
        a,
        button {
          color: ${props => props.theme.grayDark};
          background: transparent;
          text-transform: capitalize;
          padding: 5px 10px 5px 30px;

          :after {
            content: '';
          }
        }
      }
      &.subMenu--active {
        transition: all 0.3s ease;
        display: block;
        li {
          a.active,
          button.active {
            color: ${props => props.theme.tertiary};
            font-weight: 700;
            letter-spacing: 1px;
          }
        }
      }
    }

    .header {
      text-transform: uppercase;
      font-weight: bold;
      color: ${props => props.theme.grayDark};
      padding: 5px 10px;
      span {
        font-size: ${x => x.theme.fontSize.xs};
      }
    }
  }
`;

export const StyledOverlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.1);
  animation: kt-animate-fade-in 0.3s linear 1;
`;
