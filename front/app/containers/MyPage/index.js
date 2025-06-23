/**
 *
 * MyPage
 *
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import author from 'assets/images/common/author.png';
import { VideoGrid } from 'components/VideoGrid/VideoGrid';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import { makeSelectListVideos } from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import './MyPage.scss';
import { loadVideos } from './actions';

const key = 'MyPage';

export function MyPage({ intl, listVideos, onLoad }) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <main className="container-fluid">
      <section className="user-heading">
        <div className="row">
          <div className="col-12">
            <img src={author} className="profile-pic" alt="author" />
            <div className="user-info">
              <div className="user-name">Author</div>
              <div className="user-stat">
                <i className="fas fa-thumbs-up" /> <span>18,400</span>
                <i className="fas fa-play-circle" /> <span>15 Videos</span>
                <i className="fas fa-signal" /> <span>Rank 3rd</span>
                <i className="fas fa-star" /> <span>350 Points</span>
                <a href="/" className="btn-black">
                  Use Points
                </a>
                <a href="/profile" className="btn-gradient">
                  Edit Account
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="vid-list-category">
        <div>
          <VideoGrid
            title={intl.formatMessage({ ...messages.myvideos })}
            list={listVideos}
          />
        </div>
      </section>
    </main>
  );
}

MyPage.propTypes = {
  intl: intlShape.isRequired,
  listVideos: PropTypes.object,
  onLoad: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  listVideos: makeSelectListVideos(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoad: () => {
      dispatch(loadVideos());
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
)(MyPage);
