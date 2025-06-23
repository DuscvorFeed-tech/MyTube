/* eslint-disable camelcase */
import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withTheme } from 'styled-components';
import { injectIntl } from 'react-intl';

import Card from 'components/Card';
import FlowWrapper from 'components/TabFlow/Wrapper';
import FlowList from 'components/TabFlow';
import Button from 'components/Button';
import Modal from 'components/Modal';
import LoadingIndicator from 'components/LoadingIndicator';
import ModalToggler from 'components/Modal/ModalToggler';

import { nonUrlSearch } from 'utils/commonHelper';
import { forwardTo } from 'helpers/forwardTo';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import {
  Flow1State,
  Flow2State,
  DatePeriodState,
  EntryWinnerConditionState,
  WinnerConditionState,
  HashTagState,
  AccountFollowedState,
  StartDateValidation,
  EndDateValidation,
  useRafflePrizeState,
  useScheduleDistribution,
  WinStartPeriodValidation,
  WinEndPeriodValidation,
  getNumberOfRaffle,
  useUploadFile,
  PublishTwitterState,
} from './editState';
import makeSelectEditCampaignPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  setActiveTab,
  setData,
  resetData,
  getTemplate,
  getWinnerList,
  getCampDetails,
  updateCampaign,
} from './actions';

import Flow1 from './subcomponents/Flow1';
import Flow2 from './subcomponents/Flow2';
import Flow3 from './subcomponents/Flow3';
import messages from './messages';
import PATH from '../path';
// import messages from './messages';

export function EditCampaignPage(props) {
  useInjectReducer({ key: 'editCampaignPage', reducer });
  useInjectSaga({ key: 'editCampaignPage', saga });

  const [prizeDistribute, setPrizeDistribute] = useState(true);
  const {
    theme,
    intl,
    userAccount,
    changeActiveTab,
    // onSetData,
    // onGetWinnerList,
    onGetCampDetails,
    onResetData,
    editCampaignPage,
    systemSettings,
    editCampaignPage: { activeTab, campDetails, loading },
  } = props;
  const snsType = userAccount.primary.type;
  const { CampaignStatus } = props.commonTypes;
  const campaignId = props.routeParams.id;
  const isSavedSched = campDetails && [5].includes(Number(campDetails.status));
  const isScheduled = campDetails && [1].includes(Number(campDetails.status));

  useEffect(() => {
    onResetData();
    props.onSetData('loading', true);
    onGetCampDetails(campaignId, userAccount.primary.id);
  }, []);

  const flow1Fields = Flow1State(intl, campDetails);
  const dateFields = DatePeriodState(
    intl,
    campDetails,
    isSavedSched || isScheduled,
  );
  const hashtagFields = HashTagState(intl, campDetails);
  const publishTwitterState = PublishTwitterState(intl);

  const winnerConditionFields = WinnerConditionState(
    campDetails,
    flow1Fields.flow1payload.raffle_type,
  );
  const entryWinnerFields = EntryWinnerConditionState(
    intl,
    campDetails,
    winnerConditionFields.conditions,
  );
  const accountFollowedFields = AccountFollowedState(intl, campDetails);
  const flow2Fields = Flow2State(intl, campDetails);

  const campaignEndPrize = useRafflePrizeState(campDetails);
  const instantWinPrize = useRafflePrizeState(campDetails);
  const fixedWinPrize = useRafflePrizeState(campDetails);
  const postTweetViaCampsChecked = document.getElementById('postTweetViaCamps')
    ? document.getElementById('postTweetViaCamps').checked
    : false;

  const scheduleDistribution = useScheduleDistribution();
  const tweetUploadFile = useUploadFile(intl, campDetails);
  const ongoingFixedRaffle =
    !isSavedSched &&
    !isScheduled &&
    Number(flow1Fields.flow1payload.raffle_type) === 3;
  const startErrState = StartDateValidation({
    intl,
    startOnPublish: dateFields.startOnPublish.value,
    startPeriod: dateFields.startDate.toDate,
    startHour: dateFields.startHour.value,
    startMinute: dateFields.startMinute.value,
    status: campDetails.status,
    campDetails,
  });

  const endErrState = EndDateValidation({
    startOnPublish: dateFields.startOnPublish.value,
    startPeriod: dateFields.startDate.toDate,
    startHour: dateFields.startHour.value,
    startMinute: dateFields.startMinute.value,
    endPeriod: dateFields.endDate.toDate,
    endHour: dateFields.endHour.value,
    endMinute: dateFields.endMinute.value,
    ongoingFixedRaffle,
    intl,
  });

  const winStartErrState = WinStartPeriodValidation({
    intl,
    startPeriod: entryWinnerFields.winStartPeriod,
    startHour: entryWinnerFields.winStartHour.value,
    startMinute: entryWinnerFields.winStartMinute.value,
  });

  const winEndErrState = WinEndPeriodValidation({
    startOnPublish: false,
    endPeriod: entryWinnerFields.winEndPeriod,
    endHour: entryWinnerFields.winEndHour.value,
    endMinute: entryWinnerFields.winEndMinute.value,
    startPeriod: entryWinnerFields.winStartPeriod,
    startHour: entryWinnerFields.winStartHour.value,
    startMinute: entryWinnerFields.winStartMinute.value,
  });

  // eslint-disable-next-line no-unused-vars
  function getCampaignPrize() {
    switch (Number(flow1Fields.raffleState.raffle_type.value)) {
      case Number(EnumRaffleTypes.INSTANT):
        return instantWinPrize;
      case Number(EnumRaffleTypes.FIXED):
        return fixedWinPrize;
      default:
        return campaignEndPrize;
    }
  }

  function extractPostId(post_id) {
    let postId = null;
    const re = new RegExp(
      '(https:\\/\\/){0,1}twitter.com\\/[a-zA-Z0-9]{1,}\\/status\\/(.*)[\\/]{0,}',
    );
    const match = post_id.match(re);
    if (match && match.length > 2) {
      [, , postId] = match;
      postId = postId.replace('/', '');
    }
    return postId;
  }

  const maxWinLimitError = flow1Fields.checkWinLimit(
    getCampaignPrize().numberOfWinners,
  );

  const filterFormFields = value => {
    if (value.toString() !== EnumFormFields.TEXTBOX) {
      return true;
    }
    if (campDetails.form_design && campDetails.form_design !== 1) {
      return false;
    }
    return true;
  };

  // eslint-disable-next-line no-unused-vars
  const invalidWinDates =
    Number(entryWinnerFields.winnerConditionType.value) === 2 &&
    Number(entryWinnerFields.previousWinnerType.value) === 2
      ? winEndErrState.invalid || winStartErrState.invalid
      : false;
  entryWinnerFields.entryWinnerPayload.winning_condition.follower_condition =
    winnerConditionFields.payload;

  const payload = {
    status: campDetails.status,
    filterFormFields,
    id: campaignId,
    post_id:
      publishTwitterState.postId.value.length > 0
        ? extractPostId(publishTwitterState.postId.value)
        : nonUrlSearch(campDetails.post_id),
    snsId: userAccount && userAccount.primary.id,
    isSavedSched,
    ...flow1Fields.flow1payload,
    ...flow2Fields.flow2payload,
    ...dateFields.datePayload,
    ...getCampaignPrize().prizePayload,
    entry_condition: accountFollowedFields.payload,
    target_hashtag: hashtagFields.hashPayload,
    ...entryWinnerFields.entryWinnerPayload,
    fixed_prize: scheduleDistribution.schedDistribution,
    imgDel: tweetUploadFile.imgDel.length === 0 ? null : tweetUploadFile.imgDel,
    tweetUploadFile,
    hashtag_entry_type: campDetails.hashtag_entry_type,
    // temporary
    media_type: campDetails && campDetails.media_type,
    sns_post_media_path: campDetails && campDetails.sns_post_media_path,
    fake_post:
      publishTwitterState.postId.value.length > 0
        ? 0
        : campDetails && campDetails.fake_post,
  };
  const { raffleTimes } = getNumberOfRaffle(
    isSavedSched && payload.startOnPublish ? new Date() : payload.start_period,
    payload.end_period || campDetails.end_period,
    payload.raffle_interval,
  );
  useEffect(() => {
    if (campDetails) {
      if (Number(payload.raffle_type) === 3) {
        if (prizeDistribute === 0) {
          scheduleDistribution.clear();
        }
        if (payload.raffle_interval && prizeDistribute) {
          scheduleDistribution.suggestPrizeDistribute(
            isSavedSched && payload.startOnPublish
              ? new Date()
              : new Date(dateFields.startPeriod),
            new Date(dateFields.endPeriod),
            payload.raffle_interval,
            fixedWinPrize.prizeInfo,
            campDetails,
            isSavedSched,
          );
        }
      }
    }
  }, [
    flow1Fields.raffleState.raffle_interval.value,
    prizeDistribute,
    campDetails,
  ]);
  useEffect(() => {
    if (dateFields.dtTouched) {
      if (isSavedSched) {
        flow1Fields.raffleState.raffle_interval.setvalue('');
        flow1Fields.raffleState.raffle_interval.onBlur();
      }
    }
  }, [
    dateFields.startOnPublish.value,
    dateFields.startPeriod,
    dateFields.endPeriod,
    dateFields.dtTouched,
  ]);
  const invalidStep1 =
    entryWinnerFields.invalid ||
    (invalidWinDates && campDetails.status !== 2) ||
    flow1Fields.invalid ||
    maxWinLimitError.invalid ||
    startErrState.invalid ||
    hashtagFields.invalid(payload.campaign_type) ||
    (endErrState.invalid && campDetails.status !== 2) ||
    getCampaignPrize().invalid(payload.raffle_type) ||
    (Number(payload.raffle_type) === 3 &&
      (!payload.raffle_interval || !prizeDistribute));

  const invalidStep2 =
    (postTweetViaCampsChecked && !flow2Fields.sns_post_content.value) ||
    !flow2Fields.dmWinTemplate.value ||
    flow2Fields.dmWinTemplate.value === '' ||
    !flow2Fields.formMessageTemplate.value ||
    flow2Fields.formMessageTemplate.value === '' ||
    flow2Fields.invalid();

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      <Helmet>
        <title>EditCampaignPage</title>
        <meta name="description" content="Description of EditCampaignPage" />
      </Helmet>
      <Card
        title={campDetails && campDetails.title}
        subTitle={
          <React.Fragment>
            {intl.formatMessage({ ...messages.status })}:{' '}
            <span className="text-success font-weight-bold">
              {CampaignStatus &&
                campDetails &&
                intl.formatMessage({
                  id: `campaignStatus${campDetails.status}`,
                  defaultMessage: CampaignStatus.filter(
                    t => t.value === campDetails.status,
                  ).map(t => t.name),
                })}
            </span>
          </React.Fragment>
        }
        component={
          <div className="row align-items-center justify-content-end">
            <div className="text-uppercase col-auto" />
          </div>
        }
        footer={
          <div className="button-holder">
            <div className="row justify-content-between">
              <div className="col-auto">
                {activeTab !== 1 ? (
                  <Button
                    tertiary
                    width="sm"
                    onClick={() => changeActiveTab(activeTab - 1)}
                  >
                    {intl.formatMessage({ ...messages.back })}
                  </Button>
                ) : (
                  <Button
                    tertiary
                    width="sm"
                    onClick={() => forwardTo(`/campaign/detail/${campaignId}`)}
                  >
                    {intl.formatMessage({ ...messages.back })}
                  </Button>
                )}
              </div>
              <div className="col-auto">
                {activeTab <= (snsType === 1 ? 2 : 1) ? (
                  <Button
                    width="sm"
                    disabled={
                      (activeTab === 1 && invalidStep1) ||
                      (activeTab === 2 && invalidStep2)
                    }
                    onClick={() => changeActiveTab(activeTab + 1)}
                  >
                    {intl.formatMessage({ ...messages.next })}
                  </Button>
                ) : (
                  <div className="row">
                    {[0, 1, 2, 9].includes(payload.status) && (
                      <>
                        <Button
                          className="mr-2"
                          width="sm"
                          secondary
                          onClick={() =>
                            props.onUpdate(payload, 1, 'updateSuccess')
                          }
                        >
                          {intl.formatMessage({ ...messages.update })}
                        </Button>
                      </>
                    )}
                    {payload.status === 5 && (
                      <>
                        <Button
                          className="mr-2"
                          width="sm"
                          secondary
                          onClick={() =>
                            props.onUpdate(payload, 1, 'saveSuccess')
                          }
                        >
                          {intl.formatMessage({ ...messages.saveAsDraft })}
                        </Button>
                        <Button
                          width="sm"
                          onClick={() =>
                            props.onUpdate(payload, 2, 'publishSuccess')
                          }
                        >
                          {intl.formatMessage({ ...messages.publish })}
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        }
      >
        <div>
          <FlowWrapper>
            <FlowList
              id="CampaignDetails"
              label={intl.formatMessage({ ...messages.campaignDetails })}
              className={activeTab === 1 && 'active'}
              onClick={() => changeActiveTab(1)}
            />
            {snsType === 1 && (
              <FlowList
                id="TemplateAndForm"
                label={intl.formatMessage({ ...messages.formContentSettings })}
                className={activeTab === 2 && 'active'}
                onClick={() => !invalidStep1 && changeActiveTab(2)}
              />
            )}
            <FlowList
              id="Confirmation"
              label={intl.formatMessage({ ...messages.confirmation })}
              className={activeTab === (snsType === 1 ? 3 : 2) && 'active'}
              onClick={() =>
                !invalidStep1 && !invalidStep2 && changeActiveTab(3)
              }
            />
          </FlowWrapper>
        </div>
        {flow1Fields && dateFields && (
          <>
            {activeTab === 1 && (
              <div className="col-10 mx-auto">
                <Flow1
                  theme={theme}
                  systemSettings={systemSettings}
                  isSavedSched={isSavedSched || isScheduled}
                  fields={{
                    flow1Fields,
                    dateFields,
                    hashtagFields,
                    entryWinnerFields,
                    winnerConditionFields,
                    accountFollowedFields,
                    scheduleDistribution,
                    campPrizes: {
                      campaignEndPrize,
                      instantWinPrize,
                      fixedWinPrize,
                    },
                    periodDateErr: {
                      startErrState,
                      endErrState,
                    },
                    winDateErr: {
                      winStartErrState,
                      winEndErrState,
                    },
                    flow2Fields,
                  }}
                  store={{
                    ...props,
                    ...editCampaignPage,
                    prizeDistribute,
                    setPrizeDistribute,
                    ongoingFixedRaffle,
                    maxWinLimitError,
                    snsType,
                  }}
                />
              </div>
            )}
            {activeTab === 2 && snsType === 1 && (
              <div className="col-10 mx-auto">
                <Flow2
                  intl={intl}
                  theme={theme}
                  isSavedSched={isSavedSched}
                  filterFormFields={filterFormFields}
                  fields={{
                    flow1Fields,
                    ...flow2Fields,
                    tweetUploadFile,
                  }}
                  store={{
                    ...props,
                    ...editCampaignPage,
                    snsType,
                    userAccount,
                  }}
                  validatorEffect={{
                    ...publishTwitterState,
                  }}
                />
              </div>
            )}
            {activeTab === (snsType === 1 ? 3 : 2) && (
              <div className="col-12">
                <Flow3
                  theme={theme}
                  filterFormFields={filterFormFields}
                  payload={{ ...payload, raffleTimes }}
                  fields={{
                    flow1Fields,
                    ...flow2Fields,
                  }}
                  store={{
                    ...props,
                    ...editCampaignPage,
                    userAccount: userAccount.primary,
                    snsType,
                  }}
                />
              </div>
            )}
          </>
        )}
      </Card>
      <Modal id="saveSuccess">
        <ModalToggler modalId="saveSuccess" />
        <div className="text-center">
          <p>
            {intl.formatMessage(
              { id: 'M0000003' },
              {
                name: intl.formatMessage(messages.campaign),
                status: intl.formatMessage(messages.saved),
              },
            )}
          </p>
          <div className="row mt-4 justify-content-center">
            <div className="col-4">
              <Button
                secondary
                dataDismiss="modal"
                onClick={() =>
                  forwardTo(`${PATH.CAMPAIGN_DETAIL}/${campaignId}`)
                }
              >
                {intl.formatMessage({ ...messages.ok })}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal id="updateSuccess">
        <ModalToggler modalId="updateSuccess" />
        <div className="text-center">
          <p>
            {intl.formatMessage(
              { id: 'M0000003' },
              {
                name: intl.formatMessage(messages.campaign),
                status: intl.formatMessage(messages.update),
              },
            )}
          </p>
          <div className="row mt-4 justify-content-center">
            <div className="col-4">
              <Button
                secondary
                dataDismiss="modal"
                onClick={() =>
                  forwardTo(`${PATH.CAMPAIGN_DETAIL}/${campaignId}`)
                }
              >
                {intl.formatMessage({ ...messages.ok })}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal id="publishSuccess">
        <ModalToggler modalId="publishSuccess" />
        <div className="text-center">
          <p>
            {intl.formatMessage(
              { id: 'M0000003' },
              {
                name: intl.formatMessage(messages.campaign),
                status: intl.formatMessage(messages.published),
              },
            )}
            !
          </p>
          <div className="row mt-4 justify-content-center">
            <div className="col-4">
              <Button
                secondary
                dataDismiss="modal"
                onClick={() =>
                  forwardTo(`${PATH.CAMPAIGN_DETAIL}/${campaignId}`)
                }
              >
                {intl.formatMessage({ ...messages.ok })}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

EditCampaignPage.propTypes = {
  editCampaignPage: PropTypes.any,
  theme: PropTypes.object,
  intl: PropTypes.any,
  changeActiveTab: PropTypes.func,
  onSetData: PropTypes.any,
  // eslint-disable-next-line react/no-unused-prop-types
  onGetTemplate: PropTypes.any,
  // onGetWinnerList: PropTypes.any,
  onGetCampDetails: PropTypes.any,
  onResetData: PropTypes.any,
  routeParams: PropTypes.any,
  onUpdate: PropTypes.any,
  commonTypes: PropTypes.object,
  userAccount: PropTypes.any,
  systemSettings: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  editCampaignPage: makeSelectEditCampaignPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    changeActiveTab: x => dispatch(setActiveTab(x)),
    onGetTemplate: (id, isPost = false) => {
      if (id) {
        dispatch(getTemplate(id, isPost));
      }
    },
    onGetWinnerList: (id, page = 1) => dispatch(getWinnerList({ id, page })),
    onGetCampDetails: (id, snsId, page = 1) =>
      dispatch(getCampDetails({ id, snsId, page })),
    onSetData: (key, value) => dispatch(setData(key, value)),
    onUpdate: (data, btnType, modal) =>
      dispatch(updateCampaign(data, btnType, modal)),
    onResetData: () => dispatch(resetData()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
  withTheme,
  injectIntl,
)(EditCampaignPage);
