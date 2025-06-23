import React from 'react';
import PropTypes from 'prop-types';
import { RiPlayCircleLine } from 'react-icons/ri';
import { FaStar, FaGift } from 'react-icons/fa';
import './VideoPreview.scss';
// import { Link } from 'react-router-dom';
import author from 'assets/images/common/author.png';
// eslint-disable-next-line react/prefer-stateless-function
export class VideoPreview extends React.Component {
  render() {
    const { videoDetail } = this.props;
    const horizontal = this.props.horizontal ? 'horizontal' : null;
    return (
      <div
        key={`${videoDetail && videoDetail.index}`}
        className={['col-md-6 col-lg-4 col-video', horizontal].join(' ')}
      >
        <a
          href={`/watch/v/${videoDetail && videoDetail.hash}`}
          className="box-video"
        >
          {videoDetail.videoThumbnailUrl && (
            <img
              src={`${videoDetail && videoDetail.videoThumbnailUrl}`}
              alt="thumb"
            />
          )}
          <div className="overlay">
            <RiPlayCircleLine size="3em" />
          </div>
          <div className="video-time">
            <span>{videoDetail.duration}</span>
          </div>
        </a>
        <a
          href={`/watch/v/${videoDetail && videoDetail.hash}`}
          className="vid-details"
        >
          <div className="box-details">
            <img src={author} alt="" className="author-vid" />
            <div className="details">
              <span className="vid-title">
                {videoDetail && videoDetail.title}
              </span>
              <span className="author-name">{videoDetail.username}</span>
              <div className="views-days-icons">
                <span className="views">{videoDetail.videoViewCount}</span>{' '}
                <span className="dash">|</span>{' '}
                <span className="days">{videoDetail.postedSince}</span>
              </div>
            </div>
          </div>

          <div className="mobile-box-details">
            <span className="vid-title">
              {videoDetail && videoDetail.title}
            </span>
            <div className="views-days">
              <span className="views">{videoDetail.videoViewCount}</span>{' '}
              <span className="dash">|</span>{' '}
              <span className="days">{videoDetail.postedSince}</span>
            </div>
            <div className="author-details">
              <img src={author} alt="" className="author-vid" />
              <div className="name-icons">
                <div className="author-name">{videoDetail.username}</div>
                {/* <FaStar />
                <span>Like</span>
                <FaGift />
                <span>Present</span> */}
              </div>
            </div>
          </div>
        </a>
      </div>
    );
  }
}

VideoPreview.propTypes = {
  horizontal: PropTypes.bool,
  videoDetail: PropTypes.any,
};
