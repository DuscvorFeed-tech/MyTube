/* eslint-disable react/prop-types */
import React from 'react';
import './NextUpVideo.scss';
import { Checkbox, Divider } from 'semantic-ui-react';
import { VideoPreview } from '../../VideoPreview/VideoPreview';

export function NextUpVideo(props) {
  return (
    <React.Fragment>
      <div className="next-up-container">
        <h4>Up Next</h4>
        <div className="up-next-toggle">
          <span>Autoplay</span>
          <Checkbox toggle defaultChecked />
        </div>
      </div>
      <VideoPreview horizontal videoDetail={props.nextVideo} />
      <Divider />
    </React.Fragment>
  );
}
