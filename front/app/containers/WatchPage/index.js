/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
// import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';

import {
  makeSelectUsername,
  makeSelectRelatedVideos,
  makeSelectNextVideo,
  makeSelectVideoDetail,
  makeSelectError,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
// import { RelatedVideos } from '../../components/RelatedVideos/RelatedVideos';
import { Video } from '../../components/Video/Video';
import { VideoMetadata } from '../../components/VideoMetadata/VideoMetadata';
// import { VideoInfoBox } from '../../components/VideoInfoBox/VideoInfoBox';
// import { Comments } from '../Comments/Comments';
import './Watch.scss';
import { loadVideoDetail } from './actions';

const key = 'watch';

export function WatchPage({
  // username,
  onSubmitForm,
  routeParams: { hash },
  // relatedVideos,
  // nextVideo,
  videoDetail,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  useEffect(() => {
    // When initial state username is not null, submit the form to load repos
    if (hash && hash.trim().length > 0) onSubmitForm(hash);
  }, []);

  return (
    <div className="watch-container">
      <div className="watch-grid11">
        <Video className="video-container" response={videoDetail} />
        <VideoMetadata
          className="metadata"
          viewCount={
            videoDetail && videoDetail.videoViewCount
              ? videoDetail.videoViewCount
              : '0 view'
          }
          response={videoDetail}
        />
      </div>
    </div>
  );
}

WatchPage.propTypes = {
  onSubmitForm: PropTypes.func,
  // username: PropTypes.string,
  videoDetail: PropTypes.any,
  routeParams: PropTypes.any,
  // relatedVideos: PropTypes.object,
  // nextVideo: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  videoDetail: makeSelectVideoDetail(),
  username: makeSelectUsername(),
  error: makeSelectError(),
  relatedVideos: makeSelectRelatedVideos(),
  nextVideo: makeSelectNextVideo(),
});

export function mapDispatchToProps(dispatch) {
  return {
    // onChangeUsername: evt => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: hash => {
      dispatch(loadVideoDetail(hash));
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
)(WatchPage);
