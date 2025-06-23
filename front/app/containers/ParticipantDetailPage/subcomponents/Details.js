/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { config } from 'utils/config';

import Button from 'components/Button';
import Form from 'components/Form';
import ErrorFormatted from 'components/ErrorFormatted';

import messages from '../messages';

function Details(props) {
  const {
    intl,
    userAccount,
    participantDetailPage: { partDetails, error, campDetails },
    commonTypes: { FormStatus, ClaimStatus },
    checkEntStatus,
  } = props;
  const snsType = userAccount.primary.type;
  return (
    <div className="border-bottom py-4">
      {error && <ErrorFormatted invalid list={[error]} />}
      {campDetails && partDetails && (
        <Form className="col-9 mx-auto">
          <div className="row">
            <div className="col-6">
              <div className="row">
                <div className="col-4 content">
                  {intl.formatMessage({ ...messages.username })}
                </div>
                <div className="col-8 label">
                  <Button
                    link
                    // delete disabled for INSTA when username is fixed
                    disabled={snsType === 2}
                    onClick={() =>
                      window.open(
                        snsType === 1
                          ? `${config.TWITTER_URL}/${partDetails.sns_username}`
                          : snsType === 2
                          ? `${config.INSTAGRAM_URL}/${
                              partDetails.sns_username
                            }`
                          : `${config.TIKTOK_URL}/@${partDetails.sns_username}`,
                      )
                    }
                  >
                    @{partDetails.sns_username}{' '}
                    {snsType === 3 && (
                      <>
                        {partDetails.verified === 0 ? (
                          <>{intl.formatMessage({ ...messages.unverified })}</>
                        ) : (
                          <>{intl.formatMessage({ ...messages.verified })}</>
                        )}
                      </>
                    )}
                  </Button>
                </div>
              </div>
              {snsType === 3 && (
                <>
                  <div className="row">
                    <div className="col-4 content">
                      {intl.formatMessage({ ...messages.nickname })}
                    </div>
                    <div className="col-8 label">{partDetails.nickname}</div>
                  </div>
                  <div className="row">
                    <div className="col-4 content">
                      {intl.formatMessage({ ...messages.signature })}
                    </div>
                    <div className="col-8 label">{partDetails.signature}</div>
                  </div>
                </>
              )}
              <div className="row">
                <div className="col-4 content">
                  {intl.formatMessage({ ...messages.followers })}
                </div>
                <div className="col-8 label">{partDetails.followers_count}</div>
              </div>
              {snsType === 3 && (
                <>
                  <div className="row">
                    <div className="col-4 content">
                      {intl.formatMessage({ ...messages.following })}
                    </div>
                    <div className="col-8 label">
                      {partDetails.following_count}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-4 content">
                      {intl.formatMessage({ ...messages.videos })}
                    </div>
                    <div className="col-8 label">{partDetails.video_count}</div>
                  </div>
                  <div className="row">
                    <div className="col-4 content">
                      {intl.formatMessage({ ...messages.heart })}
                    </div>
                    <div className="col-8 label">{partDetails.like_count}</div>
                  </div>
                </>
              )}
              {snsType !== 3 && (
                <div className="row">
                  <div className="col-4 content">
                    {intl.formatMessage({ ...messages.followed })}
                  </div>
                  <div className="col-8 label">
                    {partDetails.followed
                      ? intl.formatMessage({ ...messages.follow })
                      : null}
                  </div>
                </div>
              )}
              {snsType === 2 && (
                <div className="row">
                  <div className="col-4 content">
                    {intl.formatMessage({ ...messages.liked })}
                  </div>
                  <div className="col-8 label">
                    {partDetails.liked
                      ? intl.formatMessage({ ...messages.like })
                      : null}
                  </div>
                </div>
              )}
              <div className="row">
                <div className="col-4 content">
                  {intl.formatMessage({ ...messages.latestEntry })}
                </div>
                <div className="col-8 content">
                  <span className="label">{partDetails.entry_date}</span>
                </div>
              </div>
              <div className="row">
                <div className="col-4 content">
                  {intl.formatMessage({ ...messages.participantStatus })}
                </div>
                <div className="col-8 label">
                  {checkEntStatus(
                    moment(partDetails.entry_date, 'MMM/DD/YYYY hh:mm A'),
                    partDetails.entry_status,
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-4 content">
                  {intl.formatMessage({ ...messages.winDate })}
                </div>
                <div className="col-8 content">
                  <span className="label">{partDetails.winner_date}</span>
                </div>
              </div>
              <div className="row">
                <div className="col-4 content">
                  {intl.formatMessage({ ...messages.prize })}
                </div>
                <div className="col-8 label">{partDetails.prize_name}</div>
              </div>
              {snsType === 1 && (
                <div className="row">
                  <div className="col-4 content">
                    {intl.formatMessage({ ...messages.dmDate })}
                  </div>
                  <div className="col-8 content">
                    <span className="label">{partDetails.dm_sent_date}</span>
                  </div>
                </div>
              )}
              <div className="row">
                <div className="col-4 content">
                  {intl.formatMessage({ ...messages.formStatus })}
                </div>
                <div className="col-8 label">
                  {partDetails &&
                    partDetails.entry_status !== 0 &&
                    FormStatus &&
                    intl.formatMessage({
                      id: `formStatus${partDetails.form_status}`,
                      defaultMessage: FormStatus.find(
                        f => f.value === partDetails.form_status,
                      ).name,
                    })}
                  {/* <small className="ml-3">11/12/2019 11:11 PM</small>
                <Button link className="d-block" onClick={() => modalToggler('modalTemplatePreview')}>
                  <u>Form Preview</u>
                </Button> */}
                </div>
              </div>
              <div className="row">
                <div className="col-4 content">
                  {intl.formatMessage({ ...messages.claimStatus })}
                </div>
                <div className="col-8 label">
                  {partDetails.entry_status !== 0 &&
                    ClaimStatus &&
                    intl.formatMessage({
                      id: `claimStatus${partDetails.claimed}`,
                      defaultMessage: ClaimStatus.find(
                        f => f.value === partDetails.claimed,
                      ).name,
                    })}
                </div>
              </div>
              <div className="row">
                <div className="col-4 content">
                  {intl.formatMessage({ ...messages.latestUpdate })}
                </div>
                <div className="col-8 content">
                  <span className="label">{partDetails.updatedAt}</span>
                </div>
              </div>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
}

Details.propTypes = {
  participantDetailPage: PropTypes.any,
  commonTypes: PropTypes.object,
  intl: PropTypes.any,
  // onSetData: PropTypes.any,
  // locale: PropTypes.any,
  userAccount: PropTypes.any,
  checkEntStatus: PropTypes.func,
};

export default Details;
