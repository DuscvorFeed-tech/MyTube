/* eslint-disable react/prop-types */
import React from 'react';
import './VideoGrid.scss';
import { VideoPreview } from '../VideoPreview/VideoPreview';

export function VideoGrid(props) {
  return (
    <React.Fragment>
      <div className="row">
        {props.list &&
          props.list.map(detail => <VideoPreview videoDetail={detail} />)}
      </div>
    </React.Fragment>
  );
}
