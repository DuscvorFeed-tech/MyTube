/* eslint-disable no-unused-vars */
/**
 *
 * CreateCampaignPage
 *
 */

import React, { memo, useState, useEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withTheme } from 'styled-components';

import Card from 'components/Card';
import FlowWrapper from 'components/TabFlow/Wrapper';
import FlowList from 'components/TabFlow';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';

import { modalToggler } from 'utils/commonHelper';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { forwardTo } from 'helpers/forwardTo';
import { injectIntl } from 'react-intl';
import reducer from './reducer';
import saga from './saga';
import { fetchLabels, fetchTemplates, submitCampaign } from './actions';
import makeSelectCreateCampaignPage, {
  makeSelectLabels,
  makeSelectWinnerTemplates,
  makeSelectLoserTemplates,
  makeSelectThankyouTemplates,
  makeSelectFormTemplates,
  makeSelectErrors,
  makeSelectCampaignId,
  makeSelectFormCompleteTemplates,
  makeSelectCampList,
} from './selectors';

import Flow1 from './subcomponents/Flow1';
import Flow2 from './subcomponents/Flow2';
import Flow3 from './subcomponents/Flow3';
import {
  CampaignDetailState,
  ReffleSettingsState,
  TemplateAndFormState,
  PublishTwitterState,
  useRafflePrizeState,
  useTargetHashtagState,
  EntryWinnerConditionState,
  useScheduleDistribution,
  useStartPeriodValidation,
  useEndPeriodValidation,
  useAccountFollowed,
  WinnerConditionState,
  useUploadFile,
  useWinStartPeriodValidation,
  useWinEndPeriodValidation,
  getNumberOfRaffle,
  // usePrizeDistribution,
} from './inputStateEffect';
// import messages from './messages';
import PATH from '../path';
import { isValid } from '../../library/validator';
import messages from './messages';
const { BETA_CONTENT } = NOCONTENT;

export function CreateCampaignPage(props) {
  useInjectReducer({ key: 'createCampaignPage', reducer });
  useInjectSaga({ key: 'createCampaignPage', saga });

  const [activeTab, changeActiveTab] = useState(1);
  const [templateToggle, setTemplateToggle] = useState({
    showPostWin: false,
    showPostLose: false,
    showPostTy: false,
    showDMLose: false,
    showDMTy: false,
    showDMForm: false,
  });
  const [prizeDistribute, setPrizeDistribute] = useState(false);

  const {
    theme,
    intl,
    labels,
    campaignList,
    onLoadLabelList,
    onLoadTemplates,
    winnerTemplates,
    loserTemplates,
    thankyouTemplates,
    formCompleteTemplates,
    formTemplates,
    commonTypes,
    onSubmit,
    errors,
    userAccount,
    campaignId,
    campaignPage,
    systemSettings,
  } = props;
  const snsType = 1;
  const snsAccountName = null;
  const campaignState = CampaignDetailState(intl, snsType);
  const raffleState = ReffleSettingsState(
    intl,
    campaignState.campaignType.value,
  );
  const campaignEndPrize = useRafflePrizeState();
  const instantWinPrize = useRafflePrizeState();
  const fixedWinPrize = useRafflePrizeState();
  const targetHashTag = useTargetHashtagState(intl);
  const accountFollowed = useAccountFollowed(intl);
  const templateAndFormState = TemplateAndFormState(intl, snsType);
  const publishTwitterState = PublishTwitterState(intl);
  const scheduleDistribution = useScheduleDistribution();
  const postTweetViaCampsChecked = publishTwitterState.postTweetViaCamps.value;

  const winnerConditionState = WinnerConditionState();
  const entryWinnerState = EntryWinnerConditionState(
    intl,
    raffleState.raffleType.value,
    winnerConditionState.conditions,
  );
  const tweetUploadFile = useUploadFile(intl);

  function getCampaignPrize() {
    switch (raffleState.raffleType.value) {
      case EnumRaffleTypes.INSTANT:
        return instantWinPrize;
      case EnumRaffleTypes.FIXED:
        return fixedWinPrize;
      default:
        return campaignEndPrize;
    }
  }

  const maxWinLimitError = raffleState.checkWinLimit(
    getCampaignPrize().numberOfWinners,
  );

  const { showConditions, winnerConditionType } = entryWinnerState;
  entryWinnerState.winning_condition.follower_condition =
    showConditions.value && Number(winnerConditionType.value) === 2
      ? winnerConditionState.payload
      : null;
  // Added condition for raffeType
  const payload = {
    title: campaignState.campaignTitle.value,
    description: campaignState.campaignDescription.value,
    label_id: campaignState.labelId.value,
    startOnPublish: campaignState.startOnPublish.value,
    start_period: campaignState.start_period,
    end_period: campaignState.end_period,
    campaign_type: campaignState.campaignType.value,
    target_hashtag: targetHashTag.payload,
    raffle_type: raffleState.raffleType.value,
    raffle_interval: raffleState.raffleInterval.value,
    auto_raffle: raffleState.autoRaffle.value,
    account_winning_limit: raffleState.winLimit.value,
    post_winner_message_template: templateAndFormState.postWinTemplate.value,
    post_loser_message_template: templateAndFormState.postLoseTemplate.value,
    post_ty_message_template: templateAndFormState.postTyTemplate.value,
    winner_message_template:
      snsType === 1 ? templateAndFormState.dmWinTemplate.value : 1,
    loser_message_template: templateAndFormState.dmLoseTemplate.value,
    ty_message_template: templateAndFormState.dmTyTemplate.value,
    fc_message_template: templateAndFormState.dmFormTemplate.value,
    template_form_id: templateAndFormState.formMessageTemplate.value,
    form_fields: templateAndFormState.form_fields,
    form_fields2: templateAndFormState.form_fields2,
    form_fields3: templateAndFormState.form_fields3,
    form_fields_required: templateAndFormState.inputFormFieldsRequired.value,
    campaign_prize: getCampaignPrize().prizeInfo,
    fixed_prize: scheduleDistribution.schedDistribution,
    numberOfWinners: getCampaignPrize().numberOfWinners,
    pubishContent: publishTwitterState.content.value,
    snsId: 1,
    templateToggle,
    entry_condition: accountFollowed.payload,
    autoSendDM: entryWinnerState.autoSendDM.value,
    winning_condition: entryWinnerState.winning_condition,
    tweetUploadFile,
    // work around because this checkbox changes value according to entry method
    post_tweet_via_camps: publishTwitterState.postTweetViaCamps.value,
    post_id: publishTwitterState.postId.value,
    hashtag_condition: campaignState.hashtagCondition.value,
  };

  const startErrState = useStartPeriodValidation({
    intl,
    startOnPublish: campaignState.startOnPublish.value,
    startPeriod: campaignState.startPeriod.toDate,
    startHour: campaignState.startHour.value,
    startMinute: campaignState.startMinute.value,
  });

  const endErrState = useEndPeriodValidation({
    intl,
    startOnPublish: campaignState.startOnPublish.value,
    endPeriod: campaignState.endPeriod.toDate,
    endHour: campaignState.endHour.value,
    endMinute: campaignState.endMinute.value,
    startPeriod: campaignState.startPeriod.toDate,
    startHour: campaignState.startHour.value,
    startMinute: campaignState.startMinute.value,
  });

  const winStartErrState = useWinStartPeriodValidation({
    intl,
    startPeriod: entryWinnerState.winStartPeriod.toDate,
    startHour: entryWinnerState.winStartHour.value,
    startMinute: entryWinnerState.winStartMinute.value,
  });

  const winEndErrState = useWinEndPeriodValidation({
    intl,
    endPeriod: entryWinnerState.winEndPeriod.toDate,
    endHour: entryWinnerState.winEndHour.value,
    endMinute: entryWinnerState.winEndMinute.value,
    startPeriod: entryWinnerState.winStartPeriod.toDate,
    startHour: entryWinnerState.winStartHour.value,
    startMinute: entryWinnerState.winStartMinute.value,
  });

  const invalidWinDates =
    Number(entryWinnerState.winnerConditionType.value) === 2 &&
    Number(entryWinnerState.previousWinnerType.value) === 2
      ? winEndErrState.invalid || winStartErrState.invalid
      : false;

  const invalidStep1 =
    entryWinnerState.invalid ||
    invalidWinDates ||
    raffleState.invalid ||
    maxWinLimitError.invalid ||
    campaignState.invalid ||
    targetHashTag.invalid(payload.campaign_type) ||
    startErrState.invalid ||
    endErrState.invalid ||
    (snsType !== 1 && templateAndFormState.formMessageTemplate.value === '') ||
    (snsType !== 1 && !templateAndFormState.formMessageTemplate.value) ||
    (snsType !== 1 && templateAndFormState.invalid(templateToggle)) ||
    getCampaignPrize().invalid(payload.raffle_type) ||
    ((payload.raffle_type === '3' &&
      (!raffleState.raffleInterval.value || !prizeDistribute)) ||
      (payload.fixed_prize &&
        payload.fixed_prize.some(
          ({ schedule }) => schedule && schedule.error,
        )));

  const entryMethod = localStorage.getItem('entryMethod');
  const invalidStep2 =
    (postTweetViaCampsChecked === true &&
      (publishTwitterState.content.value === '' ||
        !isValid([publishTwitterState.content])) &&
      snsType === 1) ||
    ((entryMethod === '1' || !entryMethod) &&
      !postTweetViaCampsChecked &&
      publishTwitterState.postId.value === '' &&
      payload.startOnPublish) ||
    !templateAndFormState.dmWinTemplate.value ||
    templateAndFormState.dmWinTemplate.value === '' ||
    !templateAndFormState.formMessageTemplate.value ||
    templateAndFormState.formMessageTemplate.value === '' ||
    (templateAndFormState.invalid(templateToggle) && snsType === 1);

  let invalidStep3 = null;
  if (entryMethod === 2 || entryMethod === '2') {
    invalidStep3 =
      (snsType === 1 && !templateAndFormState.dmWinTemplate.value) ||
      (snsType === 1 && templateAndFormState.dmWinTemplate.value === '') ||
      !templateAndFormState.formMessageTemplate.value ||
      templateAndFormState.formMessageTemplate.value === '' ||
      templateAndFormState.invalid(templateToggle);
  } else {
    invalidStep3 =
      (postTweetViaCampsChecked === true &&
        !isValid([publishTwitterState.content]) &&
        snsType === 1) ||
      (snsType === 1 && !templateAndFormState.dmWinTemplate.value) ||
      (snsType === 1 && templateAndFormState.dmWinTemplate.value === '') ||
      !templateAndFormState.formMessageTemplate.value ||
      templateAndFormState.formMessageTemplate.value === '' ||
      templateAndFormState.invalid(templateToggle);
  }

  useEffect(() => {
    if (prizeDistribute === 0) {
      scheduleDistribution.clear();
    }
    if (raffleState.raffleInterval.value && prizeDistribute) {
      scheduleDistribution.suggestPrizeDistribute(
        payload.startOnPublish ? new Date() : payload.start_period,
        payload.end_period,
        raffleState.raffleInterval.value,
        fixedWinPrize.prizeInfo,
      );
    } else {
      setPrizeDistribute(false);
    }
  }, [raffleState.raffleInterval.value, prizeDistribute]);

  useEffect(() => {
    raffleState.raffleInterval.setvalue('');
    setPrizeDistribute(false);
    scheduleDistribution.clear();
  }, [payload.startOnPublish, payload.start_period, payload.end_period]);

  const [previewContent, setPreviewContent] = useState({
    render: 0,
    content: '',
    img: [],
  });

  function getContentFromTemplate(id, templates) {
    const template = (templates || []).find(t => t.id === Number(id));
    if (template) {
      return {
        content: template.content,
        img: template.message_file ? [template.message_file] : [],
      };
    }

    return null;
  }

  function setModalState(modalId, prevContent) {
    setPreviewContent({
      render: Math.random(),
      modalId,
      content: prevContent.content,
      img: prevContent.img,
    });
  }

  useEffect(() => {
    if (previewContent.modalId) {
      modalToggler(previewContent.modalId);
    }
  }, [previewContent.render]);

  useEffect(() => {
    onLoadLabelList();
    onLoadTemplates(templateAndFormState);
  }, []);

  const { raffleTimes } = getNumberOfRaffle(
    payload.startOnPublish ? new Date() : payload.start_period,
    payload.end_period,
    payload.raffle_interval,
  );

  const minDateForPD = moment(
    !payload.startOnPublish ? moment(payload.start_period) : moment(),
  ).add(5, 'minute');

  return (
    <div>
      <Helmet>
        <title>{intl.formatMessage({ ...messages.createCampaign })}</title>
        <meta name="description" content="Description of CreateCampaignPage" />
      </Helmet>
      <Card
        title={intl.formatMessage({ ...messages.createCampaign })}
        footer={
          <div className="button-holder">
            <div className="row justify-content-between">
              <div className="col-auto">
                {activeTab !== 1 && (
                  <Button
                    tertiary
                    width="sm"
                    onClick={() => changeActiveTab(activeTab - 1)}
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
                      (activeTab === 2 && invalidStep2) ||
                      (activeTab === 3 && invalidStep3)
                    }
                    onClick={() => changeActiveTab(activeTab + 1)}
                  >
                    {intl.formatMessage({ ...messages.next })}
                  </Button>
                ) : (
                  <div className="row">
                    {!BETA_CONTENT && snsType === 1 && (
                      <Button
                        className="mr-2"
                        width="sm"
                        secondary
                        onClick={() => onSubmit(payload, true)}
                      >
                        {intl.formatMessage({ ...messages.save })}
                      </Button>
                    )}
                    <Button width="sm" onClick={() => onSubmit(payload)}>
                      {intl.formatMessage({ ...messages.publish })}
                    </Button>
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
                snsType !== 1
                  ? !invalidStep1 && changeActiveTab(2)
                  : !invalidStep1 && !invalidStep2 && changeActiveTab(3)
              }
            />
          </FlowWrapper>
        </div>
        {activeTab === 1 && (
          <div className="col-10 mx-auto">
            <Flow1
              theme={theme}
              intl={intl}
              labels={labels}
              CampaignTypes={commonTypes.CampaignType}
              RaffleTypes={commonTypes.RaffleType}
              WinnerConditionTypes={commonTypes.WinnerConditionType}
              RaffleInterval={commonTypes.RaffleInterval}
              PreventPreviousWinnerTypes={commonTypes.PreventPreviousWinnerType}
              prizeDistribute={prizeDistribute}
              setPrizeDistribute={setPrizeDistribute}
              campaignList={campaignList}
              userAccount={userAccount}
              snsType={snsType}
              systemSettings={systemSettings}
              minDateForPD={minDateForPD}
              formTemplates={formTemplates}
              setModalState={setModalState}
              previewContent={previewContent}
              getContentFromTemplate={getContentFromTemplate}
              formFields={commonTypes.FormFields}
              formFields2={commonTypes.FormFields2}
              formFields3={commonTypes.FormFields3}
              validatorEffect={{
                ...campaignState,
                ...raffleState,
                ...templateAndFormState,
                entryWinnerState,
                campaignEndPrize,
                instantWinPrize,
                fixedWinPrize,
                targetHashTag,
                accountFollowed,
                scheduleDistribution,
                startErrState,
                endErrState,
                winnerConditionState,
                maxWinLimitError,
                winDateErr: {
                  winStartErrState,
                  winEndErrState,
                },
              }}
            />
          </div>
        )}
        {activeTab === 2 && snsType === 1 && (
          <div className="col-10 mx-auto">
            <Flow2
              theme={theme}
              intl={intl}
              templateToggle={templateToggle}
              setTemplateToggle={value =>
                setTemplateToggle({ ...templateToggle, ...value })
              }
              winnerTemplates={winnerTemplates}
              loserTemplates={loserTemplates}
              thankyouTemplates={thankyouTemplates}
              formCompleteTemplates={formCompleteTemplates}
              formTemplates={formTemplates}
              formFields={commonTypes.FormFields}
              formFields2={commonTypes.FormFields2}
              formFields3={commonTypes.FormFields3}
              getContentFromTemplate={getContentFromTemplate}
              setModalState={setModalState}
              previewContent={previewContent}
              snsType={snsType}
              userAccount={userAccount}
              validatorEffect={{
                ...campaignState,
                ...templateAndFormState,
                ...publishTwitterState,
                ...raffleState,
                ...tweetUploadFile,
              }}
            />
          </div>
        )}
        {activeTab === (snsType === 1 ? 3 : 2) && (
          <div className="col-12">
            <Flow3
              intl={intl}
              errors={errors}
              theme={theme}
              detail={payload}
              labels={labels}
              loading={campaignPage.loading}
              CampaignTypes={commonTypes.CampaignType}
              RaffleTypes={commonTypes.RaffleType}
              WinnerConditionTypes={commonTypes.WinnerConditionType}
              PreventPreviousWinnerTypes={commonTypes.PreventPreviousWinnerType}
              campaignList={campaignList}
              winnerTemplates={winnerTemplates}
              loserTemplates={loserTemplates}
              thankyouTemplates={thankyouTemplates}
              formCompleteTemplates={formCompleteTemplates}
              formTemplates={formTemplates}
              formFields={commonTypes.FormFields}
              formFields2={commonTypes.FormFields2}
              formFields3={commonTypes.FormFields3}
              snsPrimary={1}
              getContentFromTemplate={getContentFromTemplate}
              setModalState={setModalState}
              previewContent={previewContent}
              raffleTimes={raffleTimes}
              snsType={snsType}
              snsAccountName={snsAccountName}
              {...publishTwitterState}
              {...tweetUploadFile}
            />
          </div>
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

CreateCampaignPage.propTypes = {
  theme: PropTypes.any,
  intl: PropTypes.any,
  onLoadLabelList: PropTypes.func,
  labels: PropTypes.object,
  onLoadTemplates: PropTypes.func,
  winnerTemplates: PropTypes.array,
  loserTemplates: PropTypes.array,
  thankyouTemplates: PropTypes.array,
  formCompleteTemplates: PropTypes.array,
  formTemplates: PropTypes.array,
  commonTypes: PropTypes.object,
  errors: PropTypes.any,
  onSubmit: PropTypes.func,
  userAccount: PropTypes.object,
  campaignId: PropTypes.string,
  campaignList: PropTypes.any,
  campaignPage: PropTypes.any,
  loading: PropTypes.any,
  systemSettings: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  labels: makeSelectLabels(),
  winnerTemplates: makeSelectWinnerTemplates(),
  loserTemplates: makeSelectLoserTemplates(),
  thankyouTemplates: makeSelectThankyouTemplates(),
  formCompleteTemplates: makeSelectFormCompleteTemplates(),
  formTemplates: makeSelectFormTemplates(),
  errors: makeSelectErrors(),
  campaignId: makeSelectCampaignId(),
  campaignList: makeSelectCampList(),
  campaignPage: makeSelectCreateCampaignPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    // changeActiveTab: x => dispatch(setActiveTab(x)),return {
    onLoadLabelList: () => dispatch(fetchLabels()),
    onLoadTemplates: state => dispatch(fetchTemplates(state)),
    onSubmit: (payload, saveOnly = false) =>
      dispatch(submitCampaign(payload, saveOnly)),
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
)(CreateCampaignPage);
