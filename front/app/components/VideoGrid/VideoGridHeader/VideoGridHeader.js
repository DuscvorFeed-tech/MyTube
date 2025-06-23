import React from 'react';
import './VideoGridHeader.scss';

export function VideoGridHeader(props) {
  return (
    <div className="row">
      <div className="col-12">
        <h2 className="category-title">{props.title}</h2>
      </div>
    </div>
  );
}
