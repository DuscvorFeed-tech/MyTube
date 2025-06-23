/* eslint-disable react/prop-types */
import React from 'react';
import './VideoMetadata.scss';
import { BsShieldLockFill } from 'react-icons/bs';
import Label from 'components/Label';
import author from 'assets/images/common/author.png';
import link from 'assets/images/common/link.svg';
import fb from 'assets/images/common/facebook-app-logo.svg';
import twitter from 'assets/images/common/twitter.svg';
import email from 'assets/images/common/envelope.svg';
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
} from 'react-share';

export function VideoMetadata(props) {
  const copyToClipboard = e => {
    navigator.clipboard.writeText(e.toString());
  };

  return (
    <div className="metadata">
      <span className="video-count">
        {props.viewCount} • {props.response && props.response.datePosted}
      </span>
      <h3>
        {props.response && props.response.title}
        {props.response && props.response.antiForgeryLicense === true && (
          <Label tooltip="Anti-forgery License">
            <BsShieldLockFill size=".5em" className="lock-icon" />
          </Label>
        )}
      </h3>
      <div className="box-details">
        <img src={author} alt="" className="author-vid" />
        <div className="details">
          <div className="author-name">
            {props.response && props.response.username}
          </div>
          <div>
            <div className="box-subscribe">
              <span className="subscribe">Subscribe</span>
            </div>
          </div>
        </div>
      </div>
      <div className="description">
        {props.response && props.response.description}
      </div>
      <div className="share-box">
        <div className="share-title">Share the video</div>
        <div className="share-title">
          <FacebookShareButton
            className="share-icon"
            quote={props.response && props.response.title}
            url={`https://dev-front.mytube.cloud/watch/v/${props.response &&
              props.response.hash}`}
            hashtag="testshare"
          >
            <img src={fb} alt="" className="share-icon-image" />
          </FacebookShareButton>
          <TwitterShareButton
            title={props.response && props.response.title}
            caption={props.response && props.response.title}
            url={`https://dev-front.mytube.cloud/watch/v/${props.response &&
              props.response.hash}`}
            tags="{testshare}"
          >
            <img src={twitter} alt="" className="share-icon-image" />
          </TwitterShareButton>
          <EmailShareButton
            subject={props.response && props.response.title}
            body="Watch this video"
            openShareDialogOnClick="true"
            url={`https://dev-front.mytube.cloud/watch/v/${props.response &&
              props.response.hash}`}
          >
            <img src={email} alt="" className="share-icon-email" />
          </EmailShareButton>
        </div>

        <div className="link-box">
          <img src={link} alt="" className="link-icon" />
          <a
            className="link"
            href={`https://dev-front.mytube.cloud/watch/v/${props.response &&
              props.response.hash}`}
            target="_blank"
          >
            {`https://dev-front.mytube.cloud/watch/v/${props.response &&
              props.response.hash}`}{' '}
          </a>
        </div>
        <div>
          <button
            className="copylink-button"
            onClick={() =>
              copyToClipboard(
                `https://dev-front.mytube.cloud/watch/v/${props.response &&
                  props.response.hash}`,
              )
            }
            type="button"
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
}
