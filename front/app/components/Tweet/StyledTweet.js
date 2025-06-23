/* eslint-disable prettier/prettier */
import styled from 'styled-components';

const StyledTweet = styled.div`
  display: block;
  width: 100%;

  .btn-delete{
    background: none;
    border: none;
    text-decoration: none;
  }

  .video-wrapper{
    max-height: 285px;
    display:flex;

    img{
      max-height: 100%;
      max-width: 100%;
    }
  }

`;


export default StyledTweet;
