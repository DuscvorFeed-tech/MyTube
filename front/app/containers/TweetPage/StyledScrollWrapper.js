import styled from 'styled-components';

const StyledScrollWrapper = styled.div`
  overflow: auto;
  max-height: 500px;
  width: 100%;
  margin: 1rem 0 0;
  padding: 0 1.5rem;

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
`;

export default StyledScrollWrapper;
