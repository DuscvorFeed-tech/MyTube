/**
 *
 * NavTab
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import StyledTabs from './StyledNavTabs';

const NavList = styled.li`
  list-style-type: none;
  margin-right: 0.3em;
  text-align: center;
`;

function NavTab(props) {
  const {
    id,
    name,
    className,
    onClick,
    label,
    disabled,
    dataTarget,
    dataToggle,
    dataDismiss,
    content,
  } = props;
  return (
    <NavList>
      <StyledTabs
        type="button"
        id={id}
        name={name}
        className={className}
        onClick={onClick}
        disabled={disabled}
        data-target={dataTarget}
        data-toggle={dataToggle}
        data-dismiss={dataDismiss}
        content={content}
        label={label}
      />
    </NavList>
  );
}

NavTab.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  dataToggle: PropTypes.string,
  dataTarget: PropTypes.string,
  dataDismiss: PropTypes.string,
  content: PropTypes.string,
};

export default memo(NavTab);
