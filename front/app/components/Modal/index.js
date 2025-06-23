/**
 *
 * Modal
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';
import StyledModal from './StyledModal';
// import styled from 'styled-components';

function Modal(props) {
  // componentDidMount() {
  //   const modalId = document.getElementById(this.props.id);
  //   modalId.addEventListener('hide.bs.modal', () => {
  //     this.props.onClose();
  //   });
  // }
  // const { id, onClose, dismissable, children, size } = props;
  const { id, className, onClose, dismissable, children, size, title } = props;
  return (
    <StyledModal
      className={`modal fade ${className}`}
      id={id}
      tabIndex="-1"
      role="dialog"
      ariaLabelledby="exampleModalCenterTitle"
      ariaHidden="true"
      dismissable={dismissable}
      size={size}
      data-backdrop="static"
      data-keyboard="false"
    >
      <div
        className="modal-dialog modal-dialog-centered custom-modal-dialog"
        role="document"
      >
        <div className="modal-content custom-modal-content">
          <div className="modal-header custom-modal-header">
            {title && <h5>{title}</h5>}
            <button
              type="button"
              className="close"
              data-dismiss={`#${id}`}
              aria-label="Close"
              data-toggle="modal"
              data-target={`#${id}`}
              onClick={onClose}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">{Children.toArray(children)}</div>
          <div className="modal-footer" />
        </div>
      </div>
    </StyledModal>
  );
}

Modal.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func,
  dismissable: PropTypes.bool,
  size: PropTypes.string,
  title: PropTypes.string,
};

export default memo(Modal);
