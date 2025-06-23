import styled from 'styled-components';

const StyledUL = styled.ul`
  border-left: 4px solid #4298c3;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
  background: rgba(255, 255, 255, 0.03);
  margin: 0px 0 0 50px;
  letter-spacing: 0.5px;
  position: relative;
  line-height: 1.4em;
  font-size: 1.03em;
  padding: 0 0 0 20px;
  list-style: none;
  text-align: left;
  font-weight: 100;

  li {
    border-bottom: 1px dashed #eaeaea;
    padding-bottom: calc(40px * 0.5);
    margin-bottom: 30px;
    position: relative;

    &:last-of-type {
      padding-bottom: 0;
      margin-bottom: 0;
      border: none;
    }

    &:before,
    &:after {
      position: absolute;
      display: block;
      top: 1px;
    }

    &:before {
      left: calc((((90px * 0.6) + 30px + 4px + 11px + (4px * 2)) * 1.5) * -1);
      content: attr(data-date);
      text-align: right;
      font-weight: 100;
      font-size: 0.9em;
      min-width: 120px;
    }

    &:after {
      box-shadow: 0 0 0 4px #fff;
      left: calc((22px + 4px + (11px * 0.35)) * -1);
      background: #fff;
      border-radius: 50%;
      height: 15px;
      width: 15px;
      content: '';
      top: 3px;
      border: 3px solid #4298c3;
    }

    &:first-child:after {
      top: 3px;
      border-color: #cd5c5c;
    }

    &:nth-child(2):after {
      border-color: #1dc9b7;
    }
    &:nth-child(3):after {
      border-color: #646c9a;
    }
    &:nth-child(4):after {
      border-color: #ffb822;
    }

    &:first-child:before {
      top: 1px;
    }
  }
`;

export default StyledUL;
