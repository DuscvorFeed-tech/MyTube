/**
 *
 * ModalToggler
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

function ModalToggler(props) {
  return (
    <React.Fragment>
      <input
        id={`modal-toggler-${props.modalId}`}
        type="hidden"
        data-toggle="modal"
        data-target={`#${props.modalId}`}
      />
    </React.Fragment>
  );
}

ModalToggler.propTypes = {
  modalId: PropTypes.string,
};

export default memo(ModalToggler);
