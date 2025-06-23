/**
 *
 * DropdownItem
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';
import { StyledDropdownItem, Wrapper } from './StyledDropdownItem';

function DropdownItem(props) {
  const { label, onClick, disabled, subMenu, children } = props;
  return (
    <React.Fragment>
      <StyledDropdownItem
        className="dropdown-item"
        type="button"
        onClick={onClick}
        disabled={disabled}
        subMenu={subMenu}
      >
        {label}
      </StyledDropdownItem>
      {subMenu && subMenu.isToggled && (
        <Wrapper>{Children.toArray(children)}</Wrapper>
      )}
    </React.Fragment>
  );
}

DropdownItem.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  subMenu: PropTypes.object,
  children: PropTypes.node,
};

export default memo(DropdownItem);
