/**
 *
 * ResetPasswordPage
 *
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { VideoGrid } from 'components/VideoGrid/VideoGrid';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import { makeSelectListVideos } from './selectors';
import reducer from './reducer';
import saga from './saga';
import './CategoryVideos.scss';
import { loadVideos } from './actions';

const key = 'categoryVideoPage';

export function CategoryVideoPage({
  listVideos,
  onLoad,
  routeParams: { videoCategoryId },
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  useEffect(() => {
    onLoad(videoCategoryId);
  }, []);

  return (
    <main className="container-fluid">
      <section className="vid-list">
        <div>
          <VideoGrid list={listVideos} />
        </div>
      </section>
    </main>
  );
}

CategoryVideoPage.propTypes = {
  listVideos: PropTypes.object,
  onLoad: PropTypes.func,
  routeParams: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  listVideos: makeSelectListVideos(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoad: searchinput => {
      dispatch(loadVideos(searchinput));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CategoryVideoPage);
