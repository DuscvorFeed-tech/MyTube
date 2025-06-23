/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl, intlShape } from 'react-intl';

import { VideoGrid } from 'components/VideoGrid/VideoGrid';
import { RiPlayCircleLine } from 'react-icons/ri';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import LoadingIndicator from 'components/LoadingIndicator';

import {
  makeSelectHotVideos,
  makeSelectError,
  makeSelectTrendingVideos,
  makeSelectLoading,
  makeSelectNewVideos,
  makeSelectFeaturedVideos,
  makeSelectGirlsDJVideos,
  makeSelectEDMVideos,
} from './selectors';
import { loadVideos } from './actions';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import './Home.scss';

const key = 'home';

export function HomePage({
  intl,
  listHot,
  onLoad,
  loading,
  listNew,
  listFeatured,
  listGirlsDJ,
  listEDM,
  routeParams: { menu },
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  useEffect(() => {
    onLoad(menu);
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <main className="container-fluid">
      <section className="vid-list-category">
        <div className="trend-category">
          <VideoGrid
            title={intl.formatMessage({ ...messages.trending })}
            list={listHot}
          />
        </div>
      </section>
    </main>
  );
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  // error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  intl: intlShape.isRequired,
  listHot: PropTypes.any,
  onLoad: PropTypes.func,
  listNew: PropTypes.any,
  listFeatured: PropTypes.any,
  listGirlsDJ: PropTypes.any,
  listEDM: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  listHot: makeSelectHotVideos(),
  listTrending: makeSelectTrendingVideos(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  listNew: makeSelectNewVideos(),
  listFeatured: makeSelectFeaturedVideos(),
  listGirlsDJ: makeSelectGirlsDJVideos(),
  listEDM: makeSelectEDMVideos(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoad: menu => {
      dispatch(loadVideos(menu));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  injectIntl,
  memo,
)(HomePage);
