import styled from 'styled-components';

const StyledMenu = styled.div`
  font-weight: 300;
  width: 100%;
  background-color: ${props => props.theme.light};
  color: ${props => props.theme.dark};
  font-size: ${props => props.theme.fontSize.lg};
  border-radius: 0.3rem;

  ul {
    display: inline-block;
    list-style-type: none;

    li {
      text-align: center;
    }

    .icon-wrap {
      background: ${props => props.theme.primary};
      border-radius: 100%;
      width: 6rem;
      height: 6rem;

      &:hover {
        background: ${props => props.theme.tertiary};
      }

      i {
        font-size: 5rem;
        vertical-align: middle;
        text-align: center;
        color: #fff;
      }
    }
  }
`;

export default StyledMenu;
