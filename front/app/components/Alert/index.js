/**
 *
 * Alert
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';
import StyledAlert from './StyledAlert';

function Alert(props) {
  const {
    className,
    children,
    autoClose,
    id,
    noclose,
    networkErrorLog,
  } = props;

  const hideAlert = () => {
    const closeBtn = document.getElementById(`alert-toggler-${id}`);
    const hideElem = closeBtn.getAttribute('data-hide');
    const elem = document.getElementById(hideElem);
    elem.classList.add('hide');
  };
  return (
    <StyledAlert
      id={id}
      className={`alert alert-dismissable ${className}`}
      role="alert"
      autoClose={autoClose}
      noclose={noclose}
      networkErrorLog={networkErrorLog}
    >
      {Children.toArray(children)}
      <button
        id={`alert-toggler-${id}`}
        type="button"
        className="close"
        data-hide={id}
        aria-label="Close"
        onClick={hideAlert}
      >
        {autoClose ? ' ' : <span aria-hidden="true">&times;</span>}
      </button>
    </StyledAlert>
  );
}

Alert.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  autoClose: PropTypes.bool,
  id: PropTypes.string,
  noclose: PropTypes.bool,
  networkErrorLog: PropTypes.bool,
};

export default memo(Alert);
