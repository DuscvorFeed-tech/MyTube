/**
 *
 * Title
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';

import StyledTitle from './StyledTitle';

function Title(props) {
  const {
    children,
    id,
    className,
    key,
    color,
    size,
    align,
    background,
    text,
    component,
    main,
    noTextTransform,
  } = props;
  return (
    <StyledTitle
      id={id}
      key={key}
      className={className}
      color={color}
      size={size}
      align={align}
      background={background}
      text={text}
      main={main}
      noTextTransform={noTextTransform}
    >
      <div className="d-flex justify-content-between">
        <div className="d-flex align-items-center">
          {text}
          {Children.toArray(children)}
        </div>
        {component && <React.Fragment>{component && component}</React.Fragment>}
      </div>
    </StyledTitle>
  );
}

Title.propTypes = {
  id: PropTypes.string,
  key: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.node,
  size: PropTypes.string,
  align: PropTypes.string,
  background: PropTypes.string,
  text: PropTypes.string,
  component: PropTypes.object,
  main: PropTypes.bool,
  noTextTransform: PropTypes.bool,
};

export default memo(Title);
