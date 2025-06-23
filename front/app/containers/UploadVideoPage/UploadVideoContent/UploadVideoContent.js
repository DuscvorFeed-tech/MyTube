import React from 'react';
import PropTypes from 'prop-types';
import './UploadVideoContent.scss';
import { Button, Header, Grid, Segment } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';

const UploadVideoContent = ({ readURL, addFile, dragLeave, dragOver }) => (
  <div className="page-content">
    <Grid centered columns={2}>
      <Grid.Column>
        <Segment>
          <Header as="h2" className="header-border">
            {'UploadVideo'}
          </Header>
          <div
            className="video-upload-wrap"
            onDragOver={dragOver}
            onDragLeave={dragLeave}
          >
            <input
              className="file-upload-input"
              type="file"
              onChange={readURL}
              accept="video/*"
            />
            <div className="drag-text">
              <Header as="h3">DragVideo</Header>
              <p>DragVideo1</p>
            </div>
          </div>
          <div className="file-upload-content d-none">
            <span className="file-upload-video" />
          </div>

          <div className="file-upload">
            <Button className="file-upload-btn" onClick={addFile}>
              {'SelectFile'}
            </Button>
            <input type="text" readOnly className="video-title" />
          </div>
        </Segment>
      </Grid.Column>
    </Grid>
  </div>
);

UploadVideoContent.propTypes = {
  readURL: PropTypes.func,
  addFile: PropTypes.func,
  dragOver: PropTypes.func,
  dragLeave: PropTypes.func,
};

export default withTranslation()(UploadVideoContent);
