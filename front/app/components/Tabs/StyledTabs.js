import styled from 'styled-components';

const StyledTabs = styled.button`
  cursor: pointer;
  border: transparent;
  background: transparent;
  color: ${props => props.theme.grayDark};
  width: 100%;
  padding: 0 1rem;
  margin: 0 auto;
  font-size: ${props => props.theme.fontSize.lg};
  text-transform: capitalize;
  vertical-align: middle;
  line-height: 1.2;
  border-bottom: 4px solid transparent;

  &:focus {
    outline: none;
  }

  &:hover {
    opacity: 0.5;
    background: transparent;
    border-bottom: 4px solid #66CEDB;
    color: ${props => props.theme.tertiary};
    font-weight: 700;

  }

  &.active {
    background: transparent;
    border-bottom: 4px solid #66CEDB;
    color: ${props => props.theme.dark};
    font-weight: 700;
  }

  :before {
    content: '${x => x.label}';
    font-weight: 600;
    font-size: 0.9rem;
    padding-bottom: 10px;
    display: block;
  }
`;

export default StyledTabs;
