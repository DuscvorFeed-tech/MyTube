/**
 *
 * SideBarRight
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import Button from 'components/Button';
import { rightSidebarToggler } from 'utils/commonHelper';

import { StyledSidebar, StyledOverlay } from './StyledSidebar';

function SideBarRight(props) {
  const { className, children } = props;

  return (
    <React.Fragment>
      <StyledSidebar className={`sidebar-right ${className}`}>
        <div className="x-btn">
          <Button icon="ef16" onClick={rightSidebarToggler} />
        </div>
        {Children.toArray(children)}
      </StyledSidebar>
      <StyledOverlay id="right-sidebar-overlay" />
    </React.Fragment>
  );
}

SideBarRight.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default memo(SideBarRight);
