/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
/**
 *
 * Pager
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';

import StyledPager from './StyledPager';

function Pager(props) {
  const [pages, setPages] = useState(false);
  const { className, align } = props;

  const fetchPageNumbers = () => {
    const totPage = props.totalPage;
    const curPage = props.currentPage;
    let startPage;
    let endPage;

    if (totPage <= 5) {
      startPage = 1;
      endPage = totPage;
    } else if (curPage <= 3) {
      startPage = 1;
      endPage = 5;
    } else if (curPage + 2 >= totPage) {
      startPage = totPage - 4;
      endPage = totPage;
    } else {
      startPage = curPage - 2;
      endPage = curPage + 2;
    }
    return range(startPage, endPage);
  };

  const range = (from, to, step = 1) => {
    let i = from;
    const ranges = [];

    while (i <= to) {
      ranges.push(i);
      i += step;
    }
    return ranges;
  };

  const onClickPrevious = () => {
    if (props.currentPage > 1) {
      let nextPage = props.currentPage;
      nextPage -= 1;
      props.onPageChange(nextPage, props.identity);
    }
  };

  const onClickNext = () => {
    if (props.currentPage < props.totalPage) {
      let nextPage = props.currentPage;
      nextPage += 1;
      props.onPageChange(nextPage, props.identity);
    }
  };

  const onClickFirst = () => {
    props.onPageChange(1, props.identity);
  };

  const onClickLast = () => {
    props.onPageChange(props.totalPage, props.identity);
  };

  useEffect(() => {
    setPages(fetchPageNumbers());
  }, [props]);

  if (props.totalPage < 2) {
    return null;
  }

  if (props.isVisible) {
    return null;
  }

  return (
    <StyledPager className={className} align={align}>
      <nav aria-label="Page navigation example">
        <ul
          className={`pagination ${x =>
            x.align ? x.align : 'justify-content-center'}`}
        >
          <li className={props.currentPage === 1 ? 'd-none' : 'page-item'}>
            <Button className="page-link" tabIndex="-1" onClick={onClickFirst}>
              {'<<'}
            </Button>
          </li>
          <li className={props.currentPage === 1 ? 'd-none' : 'page-item'}>
            <Button
              className="page-link"
              value={props.currentPage - 1}
              tabIndex="-1"
              onClick={onClickPrevious}
            >
              {'<'}
            </Button>
          </li>
          {pages &&
            pages.map(page => (
              <li
                className={
                  page === props.currentPage
                    ? 'page-item active'
                    : 'pager-link disabled'
                }
                key={page.toString()}
              >
                <Button
                  pager
                  className="page-link"
                  onClick={() => {
                    props.onPageChange(page, props.identity);
                  }}
                >
                  {page}
                </Button>
              </li>
            ))}
          <li
            className={
              props.currentPage === props.totalPage ? 'd-none' : 'page-item'
            }
          >
            <Button
              className={
                props.currentPage !== props.totalPage
                  ? 'page-link'
                  : 'page-link disabled'
              }
              onClick={onClickNext}
            >
              {'>'}
            </Button>
          </li>
          <li
            className={
              props.currentPage === props.totalPage ? 'd-none' : 'page-item'
            }
          >
            <Button
              className={
                props.currentPage !== props.totalPage
                  ? 'page-link'
                  : 'page-link disabled'
              }
              onClick={onClickLast}
            >
              {'>>'}
            </Button>
          </li>
        </ul>
      </nav>
    </StyledPager>
  );
}

Pager.propTypes = {
  className: PropTypes.string,
  isVisible: PropTypes.bool,
  align: PropTypes.string,
  identity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onPageChange: PropTypes.func,
  totalPage: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  currentPage: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
};

export default memo(Pager);
