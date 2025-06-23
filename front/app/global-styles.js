import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`

html, body {
    font-family: $lato;
    font-size: 1em;
    color: $black;
    margin: 0px; 
    height: 100%;
    width: 100%;
  }
  
  h2 {
    letter-spacing: 0.0625em;
    text-transform: uppercase;
  
    @media screen and (max-width: 480px) {
      font-size: 1em;
    }
  }
  
  main {
    height: 100%;
    padding-top: 100px;
    padding-left: 255px !important;
  
    @media screen and (max-width: 1024px) {
      padding-left: 0px !important;
    }
  
  }
  
  .box-category {
    position: absolute;
    background: $gradient;
    padding: 2px 10px 6px;
    z-index: 4;
    top: 10px;
  
  
    span {
      color: $white;
      font-size: 0.625em;
      text-transform: uppercase;
    }
  }
  
  .box-video {
    display: block;
    position: relative;
    height: 190px;
    width: 100%;
    // overflow: hidden;
  
    @media screen and (max-width: 1280px) {
      height: 160px;
    }
  

    .box-category {
      left: -5px;
    }
  
    img {
      width: 100%;
      height: 190px;
      object-fit: cover;
  
      @media screen and (max-width: 1280px) {
        height: 160px;
      }
  
    }
  
    .overlay {
      background: rgba(0,0,0,0.5);
      width: 100%;
      height: 190px;
      position: absolute;
      z-index: 3;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      opacity: 0;
      display: flex; 
      align-items: center;
      justify-content: center;
      text-align: center;
      -webkit-transition: all 0.4s ease-in-out 0s;
      -moz-transition: all 0.4s ease-in-out 0s;
      transition: all 0.4s ease-in-out 0s;
  
      @media screen and (max-width: 1280px) {
        height: 160px;
      }
  
      .icons {
        color: $white;
      }
    }
  
    &:hover {
      
      .overlay {
        opacity: 1;
      }
      
    }
  
    .video-time {
      position: absolute;
      background: $black;
      padding: 0px 10px 5px;
      z-index: 4;
      bottom: 5px;
      right: 5px;
  
      span {
        color: $white;
        font-size: 0.625em;
        text-transform: uppercase;
      }
    }
  }
  

  .vid-details {
    color: #000;
    position: relative;
    text-decoration: none;
  
  
    .box-details {
      display: flex;
      padding-top: 10px;
      padding-bottom: 40px;
  
      .author-vid {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 50%;
        background: $white;
        margin-right: 10px;
      }
  
      .details {
  
        .vid-title {
          display: block;
          font-size: 0.75em;
          font-weight: 700;
        }
  
        .author-name {
          display: block;
          color: #565656;
          font-family: Inter, var(--default-font-family);
          font-size: 16.799999237060547px;
          font-weight: 400;
          line-height: 20px;
          text-align: left;
          white-space: nowrap;
        }
  
        .views-days-icons {
          display: flex;
          margin-top: 0px;
          align-items: center;
  
          .views, .days {
            font-size: 0.625em;
          }
  
          .dash {
            margin-right: 3px;
            margin-left: 3px;
          }
  
          .icons {
            color: $red;
            margin-left: 3px;
          }
        }
      }
    }
  
    .mobile-box-details {
      display: none;
      padding: 0px 5px;
  
  
      .vid-title {
        display: block;
        font-size: 0.875em;
        font-weight: 700;
      }
  
      .views-days {
        display: flex;
        margin-top: 5px;
        align-items: center;
        font-size: 0.75em;
      }
  
      .dash {
        margin: 0px 3px;
      }
  
      .author-details {
        display: flex;
        margin-top: 10px;
  
        .author-vid {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 10px;
        }
  
        .author-name {
          color: #565656;
          font-family: Inter, var(--default-font-family);
          font-size: 16.799999237060547px;
          font-weight: 400;
          line-height: 20px;
          text-align: left;
          white-space: nowrap;
          margin-bottom: 5px;
        }
  
        .name-icons {
  
          span {
            margin-right: 2px;
            font-size: 0.625em;
          }
        }
      }
  
    }
  }
  
  .btn-upload {
    background: $light-grey ;
    color: $black;
    font-weight: 700;
    text-decoration: none;
    padding: 10px 20px;
    border: 0px;
  }
  
  .input-text {
    border: 1px solid $grey;
    border-radius: 5px;
    width: 100%;
    padding: 15px;
    outline: 0;
  }
  
  .textarea {
    width: 100%;
    height: 300px;
    resize: unset;
    border: 1px solid $grey;
    border-radius: 5px;
    padding: 15px;
    outline: 0;
    font-family: $lato;
  
    @media screen and (max-width: 480px) {
      height: 120px;
    }
  }
  
  .btn-gradient {
    background: $gradient;
    color: $white;
    padding: 10px 20px;
    border: 0px;
  }

  .modal-open {
    padding: 0;
  }
  .fade-enter {
    opacity: 0.01;
  }

  .fade-enter.fade-enter-active {
    opacity: 1;
    transition: opacity 200ms ease-in;
  }

  .fade-exit {
    opacity: 1;
  }

  .fade-exit.fade-exit-active {
    display: none;
  }  

`;

export default GlobalStyle;
