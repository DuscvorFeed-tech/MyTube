import styled from 'styled-components';

const StyledNavTabs = styled.button`
  cursor: pointer;
  border: transparent;
  background: transparent;
  color: ${props => props.theme.tertiary};
  width: 100%;
  padding: 1rem 1rem;
  margin: 0 auto;
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: 700;
  text-transform: uppercase;
  vertical-align: middle;
  line-height: 1.2;
  flex-direction: column;
  text-align: center !important;

  &:focus {
    outline: none;
  }

  &:hover {
    opacity: 0.5;
    background: transparent;

  }

  &.active {
    background: transparent;
    color: ${props => props.theme.primary};

  }

  :before {
    content: '${x => x.label}';
    font-weight: 600;
    font-size: 0.9rem;
    padding-bottom: 10px;
    display: block;
    text-indent: 20px;
    text-align: center !important;
    vertical-align: middle;
  }
`;

export default StyledNavTabs;
