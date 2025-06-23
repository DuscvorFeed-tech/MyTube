/* eslint-disable func-names */
/**
 *
 * Dropdown
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';

// components
import Image from 'components/Img';
import $ from 'jquery';
import StyledDropdown from './StyledDropdown';

function Dropdown(props) {
  const {
    primary,
    className,
    label,
    src,
    children,
    minWidth,
    fontL,
    fontM,
    fontS,
    right,
    filter,
    search,
    white,
    id,
    disabled,
  } = props;

  const onInputKeyup = e => {
    const target = e.target.id;
    const value = $(`#${target}`)
      .val()
      .toLowerCase();
    // eslint-disable-next-line array-callback-return
    $(`.dropdown-menu-${target} .dropdown-item div`).filter(function() {
      $(this).toggle(
        $(this)
          .text()
          .toLowerCase()
          .indexOf(value) > -1,
      );
    });
  };
  return (
    <StyledDropdown
      className={`dropdown ${className}`}
      primary={primary}
      minWidth={minWidth}
      fontL={fontL}
      fontM={fontM}
      fontS={fontS}
      right={right}
      filter={filter}
      white={white}
      search={search}
    >
      <button
        className="dropdown-toggle"
        type="button"
        id="dropdownMenu2"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        disabled={disabled}
      >
        {label} {src && <Image className="ml-1" isIcon src={src} alt="icon" />}
      </button>
      <div
        className={`dropdown-menu dropdown-menu-${id}`}
        aria-labelledby="dropdownMenu2"
      >
        {search && (
          <div className="search">
            <input
              id={id}
              className="form-control"
              type="text"
              placeholder="Search.."
              onKeyUp={onInputKeyup}
            />
          </div>
        )}
        {Children.toArray(children)}
      </div>
    </StyledDropdown>
  );
}

Dropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  src: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  primary: PropTypes.bool,
  minWidth: PropTypes.string,
  fontM: PropTypes.bool,
  fontL: PropTypes.bool,
  fontS: PropTypes.bool,
  right: PropTypes.bool,
  filter: PropTypes.bool,
  search: PropTypes.bool,
  white: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default memo(Dropdown);
