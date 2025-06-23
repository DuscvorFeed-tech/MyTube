/**
 *
 * Menu
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import StyledMenu from './StyledMenu';

function Menu(props) {
  const { className } = props;
  return (
    <StyledMenu className={className}>
      <div className="row">
        <div className="col">
          <ul>
            <li>
              <div className="icon-wrap active">
                <i className="fa fa-cog" />
              </div>
              <p>Manage Masters</p>
            </li>
            <li>
              <div className="icon-wrap">
                <i className="fa fa-cog" />
              </div>
              <p>Manage Masters</p>
            </li>
          </ul>
        </div>
      </div>
    </StyledMenu>
  );
}

Menu.propTypes = {
  className: PropTypes.string,
};

export default memo(Menu);
