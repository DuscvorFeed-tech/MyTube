/* eslint-disable react/prop-types */
import React from 'react';
import './Video.scss';

export function Video(props) {
  if (!props.response) {
    return null;
  }

  return (
    <div className="video-container">
      <div className="video">
        <iframe
          className="video-player"
          src={props.response.videoUrl}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={props.response.title}
        />
      </div>
    </div>
  );
}
