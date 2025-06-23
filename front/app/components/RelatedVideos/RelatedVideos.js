/* eslint-disable react/prop-types */
import React from 'react';
import { VideoPreview } from '../VideoPreview/VideoPreview';
import './RelatedVideos.scss';
import { NextUpVideo } from './NextUpVideo/NextUpVideo';

export function RelatedVideos(props) {
  return (
    <div className="related-videos">
      <NextUpVideo nextVideo={props.nextVideo} />

      <div className="related-grid">
        {props.relatedVideos &&
          props.relatedVideos.map(detail => (
            <VideoPreview horizontal videoDetail={detail} />
          ))}
      </div>
    </div>
  );
}
