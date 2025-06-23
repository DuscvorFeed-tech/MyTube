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

import { VideoPreview } from 'components/VideoPreview/VideoPreview';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import { makeSelectListVideos } from './selectors';
import reducer from './reducer';
import saga from './saga';
import './HotVideos.scss';
import { loadVideos } from './actions';

const key = 'hotVideoPage';

export function HotVideoPage({ listVideos, onLoad, routeParams: { keyword } }) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  useEffect(() => {
    onLoad(keyword);
  }, []);

  return (
    <div className="search-grid">
      {listVideos &&
        listVideos.map(detail => (
          <VideoPreview horizontal videoDetail={detail} />
        ))}
    </div>
  );
}

SearchVideoPage.propTypes = {
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
)(SearchVideoPage);
