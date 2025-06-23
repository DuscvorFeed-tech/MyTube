import styled, { css } from 'styled-components';
import select from 'assets/images/icons/down-arrow.png';

const StyledDropdown = styled.div`
  .dropdown-toggle {
    background: none;
    appearance: none;
    border: none;
    color: ${x => (x.white ? x.theme.secondary : x.theme.primary)};
    cursor: pointer;
    text-transform: uppercase;
    width: 100%;
    text-align: left;
    position: relative;
    padding-right: 20px;

    &::after {
      position: absolute;
      top: calc(50% - 2px);
      right: -15px;
      border-top: 0.4em solid;
      border-right: 0.4em solid transparent;
      border-bottom: 0;
      border-left: 0.4em solid transparent;
    }

    &[disabled] {
      pointer-events: none;
      opacity: 0.5;
    }
  }

  @media (${props => props.theme.mediaQuery.max.md}) {
    .dropdown-toggle {
      padding-right: 3px;
    }

    .dropdown-menu {
      left: 4px;
      width: auto;
    }
  }

  .dropdown-menu {
    left: 8px;
    width: auto;
  }

  ${props =>
    props.right !== undefined &&
    css`
      .dropdown-menu {
        left: unset !important;
        right: 0 !important;
      }
    `};

  ${props =>
    props.search &&
    css`
      .dropdown-menu {
        .search {
          padding: 0.25rem 0.5rem;
        }
      }
    `};

  ${props =>
    props.minWidth !== undefined &&
    css`
      .dropdown-menu {
        min-width: ${x => x.minWidth};
      }
    `};

  .dropdown-item {
    font-size: ${props => props.theme.fontSize.md};
    text-transform: uppercase;
    cursor: pointer;
    padding: 0.25rem 0.8rem;

    &:hover {
      color: ${props => (props.primary ? props.theme.primary : '')};
      font-weight: 600;
    }

    &:active {
      color: ${props => props.theme.secondary};
      background: ${x => (x.primary ? x.theme.primary : 'transparent')};
    }
  }

  ${props =>
    props.fontS &&
    css`
      font-size: ${x => x.theme.fontSize.sm};
    `};

  ${props =>
    props.fontM &&
    css`
      font-size: ${x => x.theme.fontSize.md};
    `};

  ${props =>
    props.fontL &&
    css`
      font-size: ${x => x.theme.fontSize.lg};
    `};

  ${props =>
    props.filter &&
    css`
      .dropdown-toggle {
        display: inline-block;
        width: 100%;
        padding: 0.4rem;
        background: ${x => x.theme.light} url('${select}') no-repeat 95% center;
        color: ${x => x.theme.dark};
        border: 1px solid ${x => x.theme.primary};
        font-size: ${x => x.theme.fontSize.lg};

        &:focus {
          border: 1px solid ${x => x.theme.primaryDark};
        }

        &::placeholder {
          color: ${x => x.theme.grayDark};
        }
        &::after {
          display: none;
        }
      }
    `};
`;

export default StyledDropdown;
