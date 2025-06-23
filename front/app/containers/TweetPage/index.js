/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/**
 *
 * TweetPage
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withTheme } from 'styled-components';
import moment from 'moment';
import Card from 'components/Card';
import Button from 'components/Button';
import Tabs from 'components/Tabs';
import TabsWrapper from 'components/Tabs/Wrapper';
import DatePicker from 'components/DatePicker';
import { modalToggler } from 'utils/commonHelper';
import ModalToggler from 'components/Modal/ModalToggler';
import Modal from 'components/Modal';

// import { forwardTo } from 'helpers/forwardTo';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import useSubmitEffect from 'library/submitter';
import useValidation, { isValid } from 'library/validator';
import { MediaType } from 'library/commonValues';

import PublishedTweets from './subcomponents/PublishedTweets';
import ScheduledTweets from './subcomponents/ScheduledTweets';
import SavedTweets from './subcomponents/SavedTweets';
import Modals from './subcomponents/Modals';
import Preview from './subcomponents/Preview';
import Tweet from './subcomponents/Tweet';
import StyledScrollWrapper from './StyledScrollWrapper';

import makeSelectTweetPage, { makeSelectTweetList } from './selectors';
import reducer from './reducer';
import saga from './saga';
import validation from './validators';
import messages from './messages';
import {
  setErrors,
  setData,
  resetData,
  fetchTweetList,
  submitTweet,
  deleteTweet,
} from './actions';
import {
  ImageValidation,
  ValidateSchedule,
  VidGIFValidation,
  tweetTextLengthValidation,
  onChangeScheduleValidation,
} from './tweetState';

export function TweetPage(props) {
  useInjectReducer({ key: 'tweetPage', reducer });
  useInjectSaga({ key: 'tweetPage', saga });

  const {
    userAccount,
    onSubmit,
    onSet,
    theme,
    intl,
    onGetTweetList,
    onDeleteTweet,
    // eslint-disable-next-line no-unused-vars
    tweetPage: { success, errors, isPreview, common },
  } = props;

  const [createdAt, setCreatedAt] = useState(null);
  const [tweetType, setTweetType] = useState(1);
  const [delId, setDelId] = useState(0);
  const [status, setStatus] = useState(2);
  // eslint-disable-next-line no-unused-vars
  const [isPublish, setPublish] = useState(true);
  const [state, setState] = useState({
    image: [],
    gif: '',
    video: '',
    media: MediaType.Data,
  });
  const validator = validation(props.intl);
  const tmpContent = useValidation('', validator.content);
  const { content, availableBytes } = tweetTextLengthValidation(
    intl.formatMessage({ ...messages.yourPost }),
    tmpContent,
  );
  const scheduled = ValidateSchedule(intl, tweetType);

  const invalid = !isValid([content]);

  const activeUser = 1;

  useEffect(() => {
    props.onResetData();
    props.onGetTweetList(tweetType, 1, status, createdAt);
  }, []);

  useEffect(() => {
    if (success) {
      props.onGetTweetList(tweetType, 1, status, createdAt);
      setState(() => ({
        image: [],
        gif: '',
        video: '',
        media: MediaType.Data,
      }));
      content.onClearValue('');
    }
  }, [success]);

  const submitter = useSubmitEffect(
    [
      onSubmit,
      {
        ...state,
        post_schedule: scheduled.schedDate,
        snsId: activeUser.id,
        content: content.value,
        type: tweetType,
      },
    ],
    () => !invalid,
  );
  // eslint-disable-next-line no-unused-vars
  const saveSubmit = useSubmitEffect(
    [
      onSubmit,
      {
        ...state,
        post_schedule: scheduled.schedDate,
        snsId: activeUser.id,
        content: content.value,
        type: tweetType,
        isSaveOnly: true,
      },
    ],
    () => !invalid,
  );

  const processVidGIF = (e, name, isVid = false) => {
    const err = VidGIFValidation(e, intl, isVid);
    if (err.length === 0) {
      setState(prev => ({
        ...prev,
        [name]: e.files[0],
        media: isVid ? MediaType.Video : MediaType.GIF,
      }));
    }
  };

  const processImg = (e, isAdd = false) => {
    const { imgErr, media, arr } = ImageValidation(e, state, intl, isAdd);
    if (imgErr.length > 0) {
      props.onError(imgErr);
      setState(prev => ({ ...prev, media }));
    } else {
      setState(prev => ({
        ...prev,
        image: arr,
        media,
      }));
    }
  };

  const deleteItem = () => {
    onDeleteTweet(delId, tweetType, Number(activeUser.id), status, createdAt);
  };

  const { date, hour, minute } = scheduled;
  const scheduledErr = onChangeScheduleValidation({
    intl,
    tweetType,
    date: date.dt,
    hour: hour.value,
    minute: minute.value,
  });

  return (
    <div>
      <Helmet>
        <title>{intl.formatMessage({ ...messages.Tweet })}</title>
        <meta name="description" content="Description of TweetPage" />
      </Helmet>

      {/* Start Modal */}
      <Modals submitter={submitter} />
      {/* End Modal */}
      <Card
        title={intl.formatMessage({ ...messages.Tweet })}
        footer={
          <div className="button-holder">
            <div className="row justify-content-between">
              <div className="col-auto">
                {isPreview && (
                  <Button
                    tertiary
                    width="sm"
                    onClick={() => {
                      scheduled.resetToCurrent(tweetType);
                      onSet('isPreview', false);
                    }}
                  >
                    {intl.formatMessage({ ...messages.btnBack })}
                  </Button>
                )}
              </div>
              <div className="col-auto">
                {isPreview && (
                  <div className="row">
                    {/* <Button
                      className="mr-2"
                      width="sm"
                      secondary
                      {...saveSubmit}
                      disabled={
                        (tweetType === 2 && !scheduled.schedDate) || false
                      }
                    >
                      {intl.formatMessage({ ...messages.btnSave })}
                    </Button> */}
                    {tweetType === 1 ? (
                      <Button
                        width="sm"
                        onClick={() => {
                          modalToggler('publishModal');
                        }}
                      >
                        {intl.formatMessage({ ...messages.btnPublish })}
                      </Button>
                    ) : (
                      <Button
                        width="sm"
                        onClick={() => {
                          modalToggler('scheduleModal');
                        }}
                        disabled={!scheduled.schedDate || scheduledErr}
                      >
                        {intl.formatMessage({ ...messages.btnSchedule })}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        }
      >
        {!isPreview && (
          <>
            <div className="row">
              <div className="col-6 border-right px-0">
                <div className="col mt-2 px-3">
                  <TabsWrapper className="border-bottom px-3">
                    <Tabs
                      id="flow1"
                      className={tweetType === 1 ? 'active' : ''}
                      onClick={() => {
                        setTweetType(1);
                        setStatus(2);
                        onGetTweetList(1, activeUser.id, 2);
                      }}
                      label={intl.formatMessage({
                        ...messages.publishedTweets,
                      })}
                      activeClassName="active"
                    />
                    <Tabs
                      id="flow1"
                      className={tweetType === 2 ? 'active' : ''}
                      onClick={() => {
                        setTweetType(2);
                        setStatus(1);
                        onGetTweetList(2, activeUser.id, 1);
                      }}
                      label={intl.formatMessage({
                        ...messages.scheduledTweets,
                      })}
                      activeClassName="active"
                    />
                    {/* <Tabs
                      id="flow1"
                      className={tweetType === 3 ? 'active' : ''}
                      onClick={() => {
                        setTweetType(3);
                        onGetTweetList(3, activeUser.id);
                      }}
                      label={intl.formatMessage({ ...messages.savedTweets })}
                      activeClassName="active"
                    /> */}
                  </TabsWrapper>
                  <div className="row pt-4 px-4">
                    <div className="col-auto font-weight-bold pt-2">
                      {intl.formatMessage({ ...messages.filterDate })}
                    </div>
                    <div className="col-6">
                      <DatePicker
                        value={createdAt || true}
                        onChange={e => {
                          const dt = e ? moment(e).format('MM/DD/YYYY') : null;
                          setCreatedAt(dt);
                          onGetTweetList(tweetType, activeUser.id, 2, dt);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <StyledScrollWrapper>
                  {tweetType === 1 && (
                    <PublishedTweets data={props.tweetList} userAccount={[]} />
                  )}
                  {tweetType === 2 && (
                    <ScheduledTweets
                      data={props.tweetList}
                      userAccount={activeUser}
                      setDelId={setDelId}
                    />
                  )}
                  {tweetType === 3 && (
                    <SavedTweets
                      data={props.tweetList}
                      userAccount={activeUser}
                    />
                  )}
                </StyledScrollWrapper>
              </div>
              <Tweet
                state={state}
                content={content}
                availableBytes={availableBytes}
                setState={setState}
                processImg={processImg}
                processVidGIF={processVidGIF}
                errors={errors}
                invalid={invalid}
                onSet={onSet}
              />
            </div>
          </>
        )}
        {isPreview && (
          <Preview
            state={{ ...state, content: content.value }}
            userAccount={activeUser}
            setState={setState}
            tweetType={tweetType}
            scheduled={scheduled}
            scheduledErr={scheduledErr}
            intl={intl}
            setTweetType={setTweetType}
            theme={theme}
          />
        )}
        <Modal id="DeleteTweetSuccess">
          <ModalToggler modalId="DeleteTweetSuccess" />
          <div className="text-center">
            <p>{intl.formatMessage({ ...messages.messageTweet })}</p>
            <Button
              primary
              className="col-4"
              dataDismiss="modal"
              onClick={() => {}}
            >
              {intl.formatMessage({ ...messages.btnOk })}
            </Button>
          </div>
        </Modal>
        <Modal id="DeleteConfirm" dismissable>
          <ModalToggler modalId="DeleteConfirm" />
          <div className="col-10 text-center mx-auto">
            <p>{intl.formatMessage({ ...messages.deleteConfirm })}</p>
            <Button
              primary
              className="col-3 mr-2"
              dataDismiss="modal"
              onClick={() => deleteItem()}
            >
              {intl.formatMessage({ ...messages.btnYes })}
            </Button>
            <Button primary className="col-3" dataDismiss="modal">
              {intl.formatMessage({ ...messages.btnNo })}
            </Button>
          </div>
        </Modal>
      </Card>
    </div>
  );
}

TweetPage.propTypes = {
  theme: PropTypes.any,
  onSubmit: PropTypes.func,
  onResetData: PropTypes.func,
  intl: PropTypes.any,
  onGetTweetList: PropTypes.func,
  onSet: PropTypes.func,
  onError: PropTypes.func,
  tweetList: PropTypes.any,
  tweetPage: PropTypes.any,
  userAccount: PropTypes.any,
  onDeleteTweet: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  tweetPage: makeSelectTweetPage(),
  tweetList: makeSelectTweetList(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (values, onSubmitted) => {
      dispatch(submitTweet(values, onSubmitted));
    },
    onResetData: () => {
      dispatch(resetData());
    },
    onGetTweetList: (type, snsId, status, createdAt = null) => {
      dispatch(fetchTweetList({ type, snsId, status, createdAt }));
    },
    onPublishTweet: (data, userAccount) => {
      dispatch(submitTweet(data, userAccount));
    },
    onSet: (key, value) => dispatch(setData(key, value)),
    onError: data => dispatch(setErrors(data)),
    onDeleteTweet: (id, type, snsId, status, createdAt = null) =>
      dispatch(deleteTweet({ id, type, snsId, status, createdAt })),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
  injectIntl,
  withTheme,
)(TweetPage);
