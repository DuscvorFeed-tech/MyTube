/**
 *
 * MenuToggler
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import StyledToggler from './StyledMenuToggler';

function MenuToggler(props) {
  const { className, toggleSideBar, showSidebar } = props;
  return (
    <StyledToggler id="webapp_cover" className={className}>
      <div id="menu_button">
        <input type="checkbox" checked={showSidebar} id="menu_checkbox" />
        <label
          htmlFor="menu_checkbox"
          id="menu_label"
          onClick={() => toggleSideBar()}
        >
          <div id="menu_text_bar" />
          Help
        </label>
      </div>
    </StyledToggler>
  );
}

MenuToggler.propTypes = {
  className: PropTypes.string,
  toggleSideBar: PropTypes.func,
  showSidebar: PropTypes.bool,
};

export default memo(MenuToggler);
