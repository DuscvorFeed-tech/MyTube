/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { compose } from 'redux';

import Text from 'components/Text';
import RadioButton from 'components/RadioButton';
// import Img from 'components/Img';
import Tweet from 'components/Tweet';
import Select from 'components/Select';
import DatePicker from 'components/DatePicker';
// import VideoWrapper from 'components/Video';
// import TweetImage from 'components/TweetImage';
import ErrorFormatted from 'components/ErrorFormatted';

import { MediaType } from 'library/commonValues';
import User from 'assets/images/icons/user_primary.png';

import messages from '../messages';

const Preview = props => {
  const {
    state,
    userAccount,
    tweetType,
    intl,
    scheduled,
    scheduledErr,
    setTweetType,
    theme,
  } = props;

  const { date, hour, minute } = scheduled;

  const uploadFiles = () => {
    if (state.media === MediaType.Photo) {
      return state.image;
    }
    if (state.media === MediaType.GIF) {
      return state.gif;
    }
    if (state.media === MediaType.Video) {
      return state.video;
    }
    return null;
  };
  return (
    <React.Fragment>
      <div className="row p-2">
        <div className="col-lg-5">
          <Text text={intl.formatMessage({ ...messages.preview })} />
          {/* Pending for Name */}
          <Tweet
            userImg={User}
            name={userAccount.name}
            username={userAccount.name}
            content={state.content}
            dateTime={tweetType === 1 ? new Date() : scheduled.schedDate}
            fileType={state.media}
            files={uploadFiles()}
          />
        </div>
      </div>
      <div className="row p-2">
        <div className="col-lg-5 mt-4">
          <RadioButton
            id="rb1"
            name="rb"
            for="rb1"
            text={intl.formatMessage({ ...messages.publishNow })}
            value="1"
            checked={tweetType === 1}
            onChange={() => setTweetType(1)}
          />
          <RadioButton
            id="rb2"
            name="rb"
            for="rb2"
            text={intl.formatMessage({ ...messages.schedule })}
            value="2"
            checked={tweetType === 2}
            onChange={() => setTweetType(2)}
          />
          {tweetType === 2 && (
            <div>
              <div className="pl-5 pb-5">
                <div className="row">
                  <div className="col-5">
                    <Text
                      className="ml-2"
                      size={theme.fontSize.xs}
                      text={intl.formatMessage({ ...messages.scheduleDate })}
                    />
                    <br />
                    <DatePicker minDate={new Date()} {...date} />
                  </div>
                  <div className="col pl-0">
                    <Text
                      size={theme.fontSize.xs}
                      text={intl.formatMessage({ ...messages.time })}
                    />
                    <br />
                    <ErrorFormatted {...scheduledErr} />
                    <div className="col pr-0">
                      <div className="row align-items-center justify-content-center">
                        <div className="col px-1">
                          <Select name="hour" {...hour}>
                            {[...Array(24)].map((x, i) => (
                              <option key={i + 1} value={i}>
                                {i.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </Select>
                        </div>
                        <div className="col-auto px-1 d-flex align-items-center">
                          :
                        </div>
                        <div className="col px-1">
                          <Select name="minute" {...minute}>
                            {Array(12)
                              .fill()
                              .map((_, i) => (
                                <option value={i * 5}>
                                  {(i * 5).toString().padStart(2, '0')}
                                </option>
                              ))}
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

Preview.propTypes = {
  theme: PropTypes.any,
  userAccount: PropTypes.any,
  state: PropTypes.any,
  scheduled: PropTypes.any,
  scheduledErr: PropTypes.any,
  tweetType: PropTypes.any,
  setTweetType: PropTypes.any,
  intl: PropTypes.any,
};

export default compose(injectIntl)(Preview);
