/**
 *
 * TableList
 *
 */

import React, { memo, Children } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import Button from 'components/Button';
import StyledTableList from './StyledTableList';
import ListContent from './ListContent';

const toggleTableIcon = (e, index) => {
  const btn = e.target;
  btn.classList.toggle('active--detail');
  btn.parentElement.parentElement.classList.toggle('active--detail');
  const detail = document.getElementById(index);
  detail.classList.toggle('hidden');
};

function TableList(props) {
  const {
    index,
    className,
    text,
    children,
    header,
    align,
    bgGray,
    onClick,
    toggleDetail,
  } = props;
  return (
    <StyledTableList
      index={index}
      className={`${className} ${header && 'tbl-header'}`}
      text={text}
      header={header}
      align={align}
      bgGray={bgGray}
      onClick={onClick}
      toggleDetail={toggleDetail}
    >
      {toggleDetail && (
        <ListContent width="5">
          <Button
            className="toggleIcon"
            icon="ea69"
            onClick={e => toggleTableIcon(e, index)}
          />
        </ListContent>
      )}
      {Children.toArray(children)}
    </StyledTableList>
  );
}

TableList.propTypes = {
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  text: PropTypes.string,
  children: PropTypes.node,
  header: PropTypes.bool,
  bgGray: PropTypes.bool,
  toggleDetail: PropTypes.bool,
  align: PropTypes.string,
  onClick: PropTypes.func,
};

export default memo(TableList);
