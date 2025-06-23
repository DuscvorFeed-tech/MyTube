import styled from 'styled-components';

export const StyledSearch = styled.div`
  position: relative;
`;

export const StyledAutocomplete = styled.div`
  position: absolute;
  z-index: 3;
  width: 100%;
  border: 1px solid #93939380;
  background: #ffffff;

  ul {
    padding-inline-start: 0px;
    li {
      list-style: none;
      button {
        width: 100%;
        padding: 0.3rem 1rem;
        -webkit-appearance: none;
        border: none;
        text-align: left;
        background-color: transparent;
      }
    }
  }
`;
