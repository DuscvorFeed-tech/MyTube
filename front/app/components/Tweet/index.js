/* eslint-disable no-nested-ternary */
/**
 *
 * Tweet
 *
 */
import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
// import styled from 'styled-components';

import Img from 'components/Img';
import Text from 'components/Text';
import Button from 'components/Button';
import VideoWrapper from 'components/Video';
import User from 'assets/images/icons/user_primary.png';

import TweetImage from 'components/TweetImage';
import TweetGif from 'components/TweetGif';
import IcoFont from 'react-icofont';

import { config } from 'utils/config';
import { intlShape, injectIntl } from 'react-intl';
import StyledTweet from './StyledTweet';
import {
  numeralFormat,
  modalToggler,
  formatDateTime,
} from '../../utils/commonHelper';

// import { FormattedMessage } from 'react-intl';
import messages from './messages';

const ImageMemo = ({ imgFile }) => {
  const state =
    imgFile && Array.isArray(imgFile)
      ? imgFile.map(i => i.name || i).join('|')
      : imgFile;
  const tweetImage = useMemo(() => <TweetImage imgFile={imgFile} />, [state]);
  return tweetImage;
};

function Tweet(props) {
  const {
    userImg,
    name,
    username,
    content,
    dateTime,
    onDelete,
    twitterLink,
    files,
    replyCount,
    retweetCount,
    likeCount,
    entryCount,
    intl,
    showDelete = false,
    fileType,
    setDelId,
    tweetId,
    scheduleStatus,
  } = props;

  const isFileArray = x => Array.isArray(x);

  return (
    <StyledTweet
      userImg={userImg}
      name={name}
      username={username}
      content={content}
      dateTime={dateTime}
      showDelete={showDelete}
      onDelete={onDelete}
      fileType={fileType}
    >
      <div className="tweet-holder text-left p-3">
        <div className="row">
          <div className="col-auto">
            <Img
              src={userImg || User}
              alt="user"
              className="circle2"
              width="32px"
            />
          </div>
          <div className="col px-0">
            <Text className="font-weight-bold" text={name} />
            <br />
            <Text text={username} />
          </div>
          {showDelete && (
            <div className="col-md-auto ml-auto">
              <button
                type="button"
                className="btn-delete"
                title={intl.formatMessage(messages.delete)}
                onClick={() => {
                  setDelId(tweetId);
                  modalToggler('DeleteConfirm');
                }}
              >
                <IcoFont
                  icon="icofont-ui-delete"
                  style={{
                    verticalAlign: '1px',
                    fontSize: '1.2em',
                    color: '#707070',
                  }}
                />
              </button>
            </div>
          )}
        </div>
        <div className="my-3">
          <Text text={content} />
        </div>
        {files && (
          <React.Fragment>
            {['PHOTO', '1'].includes(String(fileType)) ? (
              <>
                {isFileArray(files) ? (
                  <>{files.length > 0 && <ImageMemo imgFile={files} />}</>
                ) : (
                  <ImageMemo imgFile={files} />
                )}
              </>
            ) : ['GIF', '2'].includes(String(fileType)) ? (
              <>
                {isFileArray(files) ? (
                  <>
                    {files.length > 0 && (
                      <React.Fragment>
                        {files.map((itm, idx) => {
                          if (
                            typeof itm === 'string' &&
                            !itm.includes('http')
                          ) {
                            return (
                              <TweetGif
                                key={Number(idx)}
                                src={`${config.API_URL}/images?filename=${itm}`}
                              />
                            );
                          }
                          if (
                            scheduleStatus === 1 &&
                            itm.url &&
                            typeof itm.url === 'string' &&
                            !itm.url.includes('http')
                          ) {
                            // When video is scheduled
                            return (
                              <TweetGif
                                key={Number(idx)}
                                src={`${config.API_URL}/images?filename=${
                                  itm.url
                                }`}
                              />
                            );
                          }
                          return <TweetGif key={Number(idx)} src={itm} />;
                        })}
                      </React.Fragment>
                    )}
                  </>
                ) : (
                  <TweetGif src={files} />
                )}
              </>
            ) : (
              <>
                {['VIDEO', '3'].includes(String(fileType)) ? (
                  <>
                    {isFileArray(files) ? (
                      <>
                        {files.length > 0 && (
                          <React.Fragment>
                            {files.map((itm, idx) => {
                              if (
                                typeof itm === 'string' &&
                                !itm.includes('http')
                              ) {
                                return (
                                  <VideoWrapper
                                    key={Number(idx)}
                                    src={`${
                                      config.API_URL
                                    }/images?filename=${itm}`}
                                  />
                                );
                              }
                              if (
                                scheduleStatus === 1 &&
                                itm.url &&
                                typeof itm.url === 'string' &&
                                !itm.url.includes('http')
                              ) {
                                // When video is scheduled
                                return (
                                  <VideoWrapper
                                    key={Number(idx)}
                                    src={`${config.API_URL}/images?filename=${
                                      itm.url
                                    }`}
                                  />
                                );
                              }
                              return (
                                <VideoWrapper key={Number(idx)} src={itm} />
                              );
                            })}
                          </React.Fragment>
                        )}
                      </>
                    ) : (
                      <VideoWrapper src={files} />
                    )}
                  </>
                ) : (
                  <ImageMemo imgFile={files} />
                )}
              </>
            )}
          </React.Fragment>
        )}

        <div>
          <Text text={formatDateTime(dateTime)} className="text-muted" />
        </div>
        {twitterLink ? (
          <React.Fragment>
            <hr />
            <Button link onClick={() => window.open(twitterLink)}>
              <Text
                text={`${intl.formatMessage({
                  ...messages.M0000045,
                })}`}
              />
            </Button>
          </React.Fragment>
        ) : (
          <div className="col-12">
            <div className="row">
              <div className="col-6 mt-4">
                <div className="row">
                  <div className="col px-0">
                    <IcoFont
                      icon="icofont-ui-messaging"
                      style={{
                        fontSize: '1em',
                        marginRight: '0.5rem',
                        verticalAlign: '0',
                      }}
                    />
                    <span>{numeralFormat(replyCount)}</span>
                  </div>
                  <div className="col px-0">
                    <IcoFont
                      icon="icofont-retweet"
                      style={{
                        fontSize: '1em',
                        marginRight: '0.5rem',
                      }}
                    />
                    <span>{numeralFormat(retweetCount)}</span>
                  </div>
                  <div className="col">
                    <IcoFont
                      icon="icofont-heart"
                      style={{
                        fontSize: '1em',
                        marginRight: '0.5rem',
                      }}
                    />
                    <span>{numeralFormat(likeCount)}</span>
                  </div>
                </div>
              </div>
              {entryCount !== undefined && (
                <div className="col-3 mt-4 px-0 ml-auto text-right font-weight-bold">
                  <Text
                    className="mr-1"
                    color="#1da1f2"
                    text={intl.formatMessage({
                      ...messages.participants,
                    })}
                  />
                  <span className="color-04">{numeralFormat(entryCount)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </StyledTweet>
  );
}

Tweet.propTypes = {
  userImg: PropTypes.string,
  intl: intlShape,
  name: PropTypes.string,
  username: PropTypes.string,
  content: PropTypes.string,
  dateTime: PropTypes.string,
  onDelete: PropTypes.func,
  twitterLink: PropTypes.bool,
  showDelete: PropTypes.bool,
  files: PropTypes.any,
  // fileType: PropTypes.string,
  replyCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  retweetCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  likeCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  entryCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fileType: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setDelId: PropTypes.func,
  tweetId: PropTypes.any,
  scheduleStatus: PropTypes.number,
};

export default compose(
  memo,
  injectIntl,
)(Tweet);
