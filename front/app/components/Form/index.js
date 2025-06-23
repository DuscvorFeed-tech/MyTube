/**
 *
 * Form
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import StyledForm from './StyledForm';

function Form(props) {
  const { className, children } = props;
  return (
    <StyledForm className={className}>{Children.toArray(children)}</StyledForm>
  );
}

Form.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default memo(Form);
