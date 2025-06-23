import styled from 'styled-components';

const StyledUserAccount = styled.div`
  .userList {
    position: absolute;
    background: ${props => props.theme.light};
    box-shadow: 0px 1px 8px 0px rgba(150, 144, 144, 1);
    top: 47px;
    right: 15px;
    width: 230px;
    z-index: 1;
  }

  .user {
    border: 2px solid ${props => props.theme.primary};
    margin-left: 10px;
    border-radius: 50%;
    padding: 10px;
    img {
      width: 30px;
    }
  }

  @media (${props => props.theme.mediaQuery.max.md}) {
    .user {
      margin-left: 5px;
      border-radius: 50%;
      padding: 5px;
      img {
        width: 25px;
      }
    }
    .user-info {
      display: none;
    }
  }
`;

export default StyledUserAccount;
