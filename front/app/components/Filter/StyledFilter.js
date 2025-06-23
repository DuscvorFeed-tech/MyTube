import styled from 'styled-components';
import selectIcon from 'assets/images/icons/ico-select.png';

export const StyledFilter = styled.div`
    width: 100%;
    // margin-bottom: 3rem;

    .withBar {
    position: relative;
    color: #645959;
    padding: 3px 15px;
    cursor: pointer;
    display: inline-block;
    background: ${x => x.theme.gray} url('${selectIcon}') no-repeat 95% center;
    border: 1px solid #d4d4d4;
    border-radius: 10px;
    outline: 0;
    transition: all 0.3s ease-in-out;

    .dropdown-menu.show {
        z-index: 1;

        .dropdown-item {
        text-transform: Capitalize;
        }
    }

    .dropdown-toggle {
        text-transform: Capitalize;
        padding: 0;

        &:after {
        display: none;
        }
    }
    }

    .btnSearch {
    > button {
        margin-top: -7px;
        padding: 3px 8px;
        background: ${props => props.theme.tertiaryDarker} !important;
        background-color: ${props => props.theme.tertiaryDarker};

        > i {
        color: ${props => props.theme.light} !important;
        }
    }
    }

    `;

export const StyledHiddenDiv = styled.div`
  position: absolute;
  display: block;
  padding: 1.5rem;
  margin: 0.125rem 0 0;
  font-size: 0.9rem;
  color: ${props => props.theme.tertiaryDarker};
  text-align: left;
  list-style: none;
  background-color: ${props => props.theme.light};
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  width: 480px;
  left: 15px;
  // height: 295px;
  min-height: 185px;
  z-index: 3;

  &.active {
    display: block;
  }

  > .content {
    position: relative;

    &.filterDiv {
      width: 400px;
      padding: 1rem 0;
      left: -1px;
      top: -4px;
      height: 300px;
    }

    .scrollablefilterDiv {
      overflow: hidden;
      overflow-y: auto;
      height: 235px;

      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        background-color: #f5f5f5;
      }

      &::-webkit-scrollbar {
        width: 6px;
        background-color: #f5f5f5;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 12px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: ${x => x.theme.grayDark};
      }
    }

    > button {
      font-size: ${x => x.theme.fontSize.sm};
    }
  }
`;

export const StyledFilterDiv = styled.div`
  position: relative;
  margin-bottom: 30px;
`;
