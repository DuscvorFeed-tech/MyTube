/* eslint-disable react/prop-types */
import React from 'react';
import './Video.scss';

export function Video(props) {
  if (!props) {
    return null;
  }

  return (
    <div className="video-container">
      <div className="video">
        <iframe
          className="video-player"
          src={props}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="title"
        />
      </div>
    </div>
  );
}
