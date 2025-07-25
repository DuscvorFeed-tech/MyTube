import React from 'react';
import './VideoInfoBox.scss';
import { Image, Button, Divider } from 'semantic-ui-react';

export class VideoInfoBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };
  }

  render() {
    let descriptionTextClass = 'collapsed';
    let buttonTitle = 'Show More';
    if (!this.state.collapsed) {
      descriptionTextClass = 'expanded';
      buttonTitle = 'Show Less';
    }

    return (
      <div>
        <div className="video-info-box">
          <Image
            className="channel-image"
            src="https://via.placeholder.com/48x48"
            circular
          />
          <div className="video-info">
            <div className="channel-name">Channel Name</div>
            <div className="video-publication-date">1M subscribers</div>
          </div>
          <Button color="youtube">91.5B Subscribe</Button>
          <div className="video-description">
            <div className={descriptionTextClass}>
              <p>Paragraph 1</p>
              <p>Paragraph 2</p>
              <p>Paragraph 3</p>
              <p>Paragraph 4</p>
              <p>Paragraph 5</p>
            </div>
            <Button compact onClick={this.onToggleCollapseButtonClick}>
              {buttonTitle}
            </Button>
          </div>
        </div>
        <Divider />
      </div>
    );
  }

  onToggleCollapseButtonClick = () => {
    this.setState(prevState => ({
      collapsed: !prevState.collapsed,
    }));
  };
}
