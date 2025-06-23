/* eslint-disable prettier/prettier */
import styled from 'styled-components';

const StyledImageContainer = styled.div`
  margin: 1em auto;
  // align-items: center;
  display: flex;
  flex-basis: auto;
  flex-direction: row;
  overflow: hidden;
  border-radius: .8em;

    .item{
      align-items: stretch;
      flex: 1;
      padding: 1px;
      -webkit-box-flex: 1;
      -webkit-box-direction: normal;
      -webkit-box-orient: vertical;
      flex-basis: calc(40% - 20px);
      // margin-top: calc(-30% - 20px);

      div{
        flex: 1;
        margin-top: -2px;
        margin-bottom: 4px;
      }

      img{
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
`;


export default StyledImageContainer;
