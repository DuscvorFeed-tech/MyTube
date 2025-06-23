import React from 'react';
import PropTypes from 'prop-types';

import spinner from 'assets/images/icons/spinner.gif';
import Img from 'components/Img';
import Wrapper from './Wrapper';
import Title from '../Title';

const LoadingIndicator = props => {
  const { button, updating, height } = props;
  return (
    <Wrapper button={button} height={height}>
      <Img src={spinner} alt="loader" />
      {updating && (
        <Title main className="text-center">
          Updating new content...
        </Title>
      )}
    </Wrapper>
  );
};

LoadingIndicator.propTypes = {
  button: PropTypes.bool,
  updating: PropTypes.bool,
  height: PropTypes.string,
};

export default LoadingIndicator;
