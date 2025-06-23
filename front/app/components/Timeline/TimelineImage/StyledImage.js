import styled from 'styled-components';

const TimelineImage = styled.div`
  width: 1rem;
  height: 1rem;
  line-height: 50px;
  font-size: 1.4em;
  text-align: center;
  position: absolute;
  top: 16px;
  left: 54.8%;
  margin-left: -25px;
  z-index: 2;
  border-radius: 50%;
  border: 0.2rem solid ${props => props.theme.primary};
  background: ${props => props.theme.tertiary};

  img {
    margin-top: 1.4rem;
  }

  @media (${props => props.theme.mediaQuery.max.sm}) {
    left: 49px;
    margin-left: 20px;
    top: 16px;
  }

  @media (${props => props.theme.mediaQuery.min.lg}) {
    left: 55.8%;
  }

  @media (max-width: 320px) {
    margin-left: 0px;
  }

  @media (max-width: 767px) {
    left: 48px;
  }
`;

export default TimelineImage;
