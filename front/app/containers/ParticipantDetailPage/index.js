/* eslint-disable prettier/prettier */
/**
 *
 * ParticipantDetailPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { injectIntl, intlShape } from 'react-intl';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import Card from 'components/Card';
import Button from 'components/Button';
import Tabs from 'components/Tabs';
import TabsWrapper from 'components/Tabs/Wrapper';
import Select from 'components/Select';
import { modalToggler } from 'utils/commonHelper';
import { makeSelectLocale } from 'containers/LanguageProvider/selectors';

import { forwardTo } from 'helpers/forwardTo';
import { config } from 'utils/config';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import useValidation from 'library/validator';
import useSubmitEffect from 'library/submitter';

import {
  useUploadFile,
  PublishTwitterState,
  FormState,
} from './inputStateEffect';
import makeSelectParticipantDetailPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  setData,
  setErrors,
  resetData,
  getPartDetails,
  generateWinner,
  cancelWinner,
  selectWinner,
  sendMessage,
  changeClaimStatus,
  changeWinnerInfo,
} from './actions';

import SendMessageModal from './subcomponents/SendMessage';
import ClaimStatusModal from './subcomponents/ClaimStatus';
import ParticipantStatusModal from './subcomponents/ParticipantStatus';
import SuccessMessageModal from './subcomponents/SuccessMessage';
import LoseFlowModal from './subcomponents/LoseFlow';
import ShowCouponModal from './subcomponents/ShowCouponUrl';
import Details from './subcomponents/Details';
import FormDetails from './subcomponents/FormDetails';
import ParticipantEntryList from './subcomponents/ParticipantEntryList';
import DMRecord from './subcomponents/DMRecord';

import messages from './messages';

export function ParticipantDetailPage(props) {
  useInjectReducer({ key: 'participantDetailPage', reducer });
  useInjectSaga({ key: 'participantDetailPage', saga });

  const [tab, setActiveTab] = useState(1);

  const {
    intl,
    locale,
    onGetPartDetails,
    onSelectWinner,
    onSetData,
    onResetData,
    participantDetailPage: {
      partDetails,
      selectedValue,
      participantStatus,
      cancelledWinner,
      campDetails,
      isEdit,
      templateList,
    },
    routeParams: { entryId, campaignId },
    commonTypes: { FormStatus, ClaimStatus, EntryStatus },
    onSubmitDetails,
    userAccount,
  } = props;

  const snsType = userAccount.primary.type;

  const snsAccountId = userAccount.primary.id;

  useEffect(() => {
    onResetData();
    onGetPartDetails(entryId, campaignId, snsAccountId);
  }, []);

  const setSelectedValue = e => {
    const x = e.target.value;
    onSetData('selectedValue', Number(x));
  };

  const setParticipantStatus = e => {
    const x = e.target.value;
    onSetData('participantStatus', Number(x));
  };

  const setEdit = () => {
    if (isEdit) {
      onSetData('isEdit', false);
    } else {
      onSetData('isEdit', true);
    }
  };

  const formState = FormState(
    partDetails,
    entryId,
    campaignId,
    snsAccountId,
  );

  const submitter = useSubmitEffect(
    [onSubmitDetails, formState.payload],
    () =>
      !formState.invalidPersonalInformation &&
      !formState.invalidThankfulPerson1 &&
      !formState.invalidThankfulPerson2
  );

  const checkPartStatus = () => {
    if (partDetails.entry_status !== 1 && cancelledWinner === 0) {
      return true;
    }

    if (
      campDetails.raffle_type === Number(EnumRaffleTypes.END) &&
      campDetails.status === 0
    ) {
      return true;
    }

    // if campaign is force stop, it cannot cancel winner
    if (campDetails.status === 4) {
      return true;
    }

    return false;
  };

  const checkEntStatus = (entDate, entStatus) => {
    const stat =
      EntryStatus &&
      intl.formatMessage({
        id: `entryStatus${entStatus}`,
        defaultMessage: EntryStatus.find(f => f.value === entStatus).name,
      });

    // if Partipant is a Winner/Cancelled
    if (entStatus !== 0) {
      return stat;
    }

    if (
      (campDetails.raffle_type === Number(EnumRaffleTypes.END) &&
        campDetails.status === 0) ||
      ![2, 4].includes(campDetails.status)
    ) {
      return '';
    }

    if (
      campDetails.raffle_type === Number(EnumRaffleTypes.FIXED) &&
      campDetails.status === 0
    ) {
      let raffSchedList = campDetails.campaign_prize.map(m =>
        m.raffle_schedule.map(mm => mm.raffle_schedule),
      );
      if (typeof raffSchedList[0] !== 'string') {
        raffSchedList = [].concat(...raffSchedList);
      }

      for (let i = 0; i < raffSchedList.length; i += 1) {
        const startSched = moment(raffSchedList[0], 'MMM/DD/YYYY hh:mm A');
        const sched = moment(raffSchedList[i], 'MMM/DD/YYYY hh:mm A');
        const nextSched = moment(raffSchedList[i + 1], 'MMM/DD/YYYY hh:mm A');
        const currTime = moment(new Date(), 'MMM/DD/YYYY hh:mm A');
        if (entDate < startSched && currTime < startSched) {
          return '';
        }
        if (entDate < nextSched && entDate > sched && currTime < nextSched) {
          return '';
        }
      }
    }

    // If Participant is loser, show blank
    if (entStatus === 0) {
      return '';
    }
    return stat;
  };

  const tweetUploadFile = useUploadFile(intl);
  const publishTwitterState = PublishTwitterState(intl);
  const { content } = publishTwitterState;
  const messageTemplateId = useValidation('');

  const applyBtn = () => {
    if (selectedValue === 1) {
      content.onClearValue('', true);
      messageTemplateId.onClearValue('', true);

      if (templateList && partDetails && partDetails.winner) {
        const tempId = templateList.find(
          itm => itm.id === Number(partDetails.winner_message_template),
        );
        if (tempId) {
          if (tempId.message_file !== null) {
            tweetUploadFile.setUploadFile([tempId.message_file]);
          } else {
            tweetUploadFile.setUploadFile([]);
          }
          content.setvalue(tempId.content);
          messageTemplateId.setvalue(tempId.id);
        } else {
          tweetUploadFile.setUploadFile([]);
          content.onClearValue('', true);
          messageTemplateId.onClearValue('', true);
        }
      } else {
        content.onClearValue('', true);
        messageTemplateId.onClearValue('', true);
      }
    } else if (selectedValue === 4) {
      modalToggler('modalShowCouponUrl');
    }
    modalToggler('modalTemplatePreview');
  };

  return (
    <div>
      <Helmet>
        <title>{intl.formatMessage({ ...messages.participantDetail })}</title>
        <meta
          name="description"
          content="Description of Participant Detail Page"
        />
      </Helmet>

      <Card
        title={
          partDetails
            ? `@${partDetails.sns_username}
            ${intl.formatMessage({ ...messages.details })}`
            : intl.formatMessage({ ...messages.details })
        }
        className="p-0"
        component={
          <div className="row align-items-center justify-content-end">
            <div className="col-5">
              <div className="row">
                <div className="col-12 content text-right">
                  {intl.formatMessage({ ...messages.participantStatus })} :
                  {'   '}
                  {campDetails &&
                    checkEntStatus(
                      moment(partDetails.entry_date, 'MMM/DD/YYYY hh:mm A'),
                      partDetails.entry_status,
                    )}
                </div>
              </div>
              <div className="row">
                <div className="col-12 content text-right">
                  {intl.formatMessage({ ...messages.formStatus })} :{'   '}
                  {partDetails &&
                    partDetails.entry_status !== 0 &&
                    FormStatus &&
                    intl.formatMessage({
                      id: `formStatus${partDetails.form_status}`,
                      defaultMessage: FormStatus.filter(
                        f => f.value === partDetails.form_status,
                      ).name,
                    })}
                </div>
              </div>
            </div>
          </div>
        }
      >
        <div className="row border-bottom pt-4">
          <div className="col-7">
            <TabsWrapper className="justify-content-around equal">
              <Tabs
                id="flow1"
                className={tab === 1 && 'active'}
                label="Participant Details"
                onClick={() => setActiveTab(1)}
              />
              {/* Temporary Removed Campaign Chart */}
              {partDetails.entry_status === 1 && (
                <Tabs
                  id="flow2"
                  className={tab === 2 && 'active'}
                  label="Form Details"
                  onClick={() => setActiveTab(2)}
                />
              )}
              {campDetails.campaign_type === 2 && (
                <Tabs
                  id="flow3"
                  className={tab === 3 && 'active'}
                  label="Entry List"
                  onClick={() => setActiveTab(3)}
                />
              )}
              {snsType === 1 && (
                <Tabs
                  id="flow4"
                  className={tab === 4 && 'active'}
                  label= {intl.formatMessage({ ...messages.dmRecord })}
                  onClick={() => setActiveTab(4)}
                />
              )}
            </TabsWrapper>
          </div>
        </div>

        {tab === 1 && (
          <Details {...props} intl={intl} checkEntStatus={checkEntStatus} />
        )}

        {tab === 2 && (
          <FormDetails
            {...props}
            intl={intl}
            validatorEffect={{ ...formState }}
          />
        )}

        {tab === 3 && (
          <ParticipantEntryList
            {...props}
            intl={intl}
            locale={locale}
            checkEntStatus={checkEntStatus}
          />
        )}

        {tab === 4 && (
          <DMRecord
            {...props}
            intl={intl}
            locale={locale}
          />
        )}

        {tab === 2 ? (
          <div className="row mx-5 my-4">
            <div className="col-auto">
              <Button
                width="sm"
                tertiary
                small
                onClick={() =>
                  forwardTo({
                    pathname: `/campaign/detail/${campaignId}`,
                    pathInfo: {
                      backUrl: 'participant',
                    },
                  })
                }
              >
                {intl.formatMessage({ ...messages.back })}
              </Button>
            </div>
            {isEdit ? (
              <>
                <div className="col-auto ml-auto">
                  <Button
                    width="sm"
                    primary
                    small
                    disabled={
                      formState.invalidPersonalInformation ||
                      formState.invalidThankfulPerson1 ||
                      formState.invalidThankfulPerson2
                    }
                    {...submitter}
                  >
                    {intl.formatMessage({ ...messages.save })}
                  </Button>
                </div>
                <div className="col-auto">
                  <Button
                    width="sm"
                    secondary
                    small
                    onClick={() => onSetData('isEdit', false)}
                  >
                    {intl.formatMessage({ ...messages.cancel })}
                  </Button>
                </div>
              </>
            ) : (
                <>
                  <div className="col-3 ml-auto">
                    <Select
                      onChange={e => setSelectedValue(e)}
                      value={selectedValue}
                    >
                      <option value="0">
                        {intl.formatMessage({ ...messages.chooseAction })}
                      </option>
                      {snsType === 1 && (
                        <option value="1">
                          {intl.formatMessage({ ...messages.sendMessage })}
                        </option>
                      )}
                      <option
                        value="2"
                        disabled={partDetails && partDetails.entry_status !== 1}
                      >
                        {intl.formatMessage(
                          { id: 'T0000017' },
                          {
                            name: intl.formatMessage({ ...messages.claimStatus }),
                          },
                        )}
                        {/* Change Claim Status */}
                      </option>
                      <option value="3" disabled={checkPartStatus()}>
                        {intl.formatMessage(
                          { id: 'T0000017' },
                          {
                            name: intl.formatMessage({
                              ...messages.participantStatus,
                            }),
                          },
                        )}
                        {/* Change Participant Status */}
                      </option>
                      {snsType !== 1 && partDetails && partDetails.winner && (
                        <option value="4">
                          {intl.formatMessage({ ...messages.showCouponUrl })}
                        </option>
                      )}
                    </Select>
                  </div>
                  <div className="col-auto">
                    <Button
                      width="sm"
                      primary
                      small
                      disabled={selectedValue === 0}
                      onClick={() => applyBtn()}
                    >
                      {intl.formatMessage({ ...messages.apply })}
                    </Button>
                  </div>
                  <div className="col-auto">
                    <Button
                      width="sm"
                      secondary
                      small
                      onClick={() => setEdit()}
                      disabled={partDetails.form_status !== 1}
                    >
                      Edit Form
                    </Button>
                  </div>
                </>
            )}
          </div>
        ) : (
          <div className="row mx-5 my-4">
            <div className="col-auto">
              <Button
                width="sm"
                tertiary
                small
                onClick={() =>
                  forwardTo({
                    pathname: `/campaign/detail/${campaignId}`,
                    pathInfo: {
                      backUrl: 'participant',
                    },
                  })
                }
              >
                {intl.formatMessage({ ...messages.back })}
              </Button>
            </div>
            <div className="col-3 ml-auto">
              <Select onChange={e => setSelectedValue(e)} value={selectedValue}>
                <option value="0">
                  {intl.formatMessage({ ...messages.chooseAction })}
                </option>
                {snsType === 1 && partDetails && partDetails.winner && (
                  <option value="1">
                    {intl.formatMessage({ ...messages.sendMessageToWinner })}
                  </option>
                )}
                {snsType === 1 && partDetails && !partDetails.winner && (
                  <option value="1">
                    {intl.formatMessage({ ...messages.sendMessageToGeneral })}
                  </option>
                )}
                <option
                  value="2"
                  disabled={partDetails && partDetails.entry_status !== 1}
                >
                  {intl.formatMessage(
                    { id: 'T0000017' },
                    { name: intl.formatMessage({ ...messages.claimStatus }) },
                  )}
                  {/* Change Claim Status */}
                </option>
                <option value="3" disabled={checkPartStatus()}>
                  {intl.formatMessage(
                    { id: 'T0000017' },
                    {
                      name: intl.formatMessage({
                        ...messages.participantStatus,
                      }),
                    },
                  )}
                  {/* Change Participant Status */}
                </option>
                {snsType !== 1 && partDetails && partDetails.winner && (
                  <option value="4">
                    {intl.formatMessage({ ...messages.showCouponUrl })}
                  </option>
                )}
              </Select>
            </div>
            <div className="col-auto">
              <Button
                width="sm"
                primary
                small
                disabled={selectedValue === 0}
                onClick={() => applyBtn()}
              >
                {intl.formatMessage({ ...messages.apply })}
              </Button>
            </div>
          </div>
        )}

        {selectedValue === 1 && partDetails && (
          <SendMessageModal
            {...props}
            intl={intl}
            tweetState={{
              tweetUploadFile,
              publishTwitterState,
              messageTemplateId,
            }}
            winner={partDetails.winner}
          />
        )}
        {selectedValue === 2 && (
          <ClaimStatusModal {...props} ClaimStat={ClaimStatus} intl={intl} />
        )}
        {selectedValue === 3 && (
          <ParticipantStatusModal
            intl={intl}
            participantStatus={participantStatus}
            setParticipantStatus={setParticipantStatus}
            partDetails={partDetails}
            onSelectWinner={onSelectWinner}
            campaignId={campaignId}
            snsAccountId={snsAccountId}
          />
        )}
        {selectedValue === 4 && (
          <ShowCouponModal intl={intl} url={partDetails.claim_coupon_link} />
        )}
        <SuccessMessageModal value={selectedValue} {...props} intl={intl} />
        <LoseFlowModal value={selectedValue} {...props} intl={intl} />
      </Card>
    </div>
  );
}

ParticipantDetailPage.propTypes = {
  theme: PropTypes.object,
  intl: intlShape,
  participantDetailPage: PropTypes.any,
  campaignDetailPage: PropTypes.any,
  onGenerateWinner: PropTypes.any,
  onSelectWinner: PropTypes.any,
  onCancelWinner: PropTypes.any,
  onGetPartDetails: PropTypes.any,
  onSetData: PropTypes.any,
  onResetData: PropTypes.any,
  onSubmit: PropTypes.func,
  onSubmitDetails: PropTypes.any,
  routeParams: PropTypes.any,
  commonTypes: PropTypes.object,
  userAccount: PropTypes.object,
  errors: PropTypes.any,
  locale: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  participantDetailPage: makeSelectParticipantDetailPage(),
  locale: makeSelectLocale(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetPartDetails: (entryId, campaignId, snsId) =>
      dispatch(getPartDetails({ entryId, campaignId, snsId })),
    onGenerateWinner: (id, count, snsId) => dispatch(generateWinner({ id, count, snsId })),
    onSelectWinner: (ids, campaignId, snsId) =>
      dispatch(selectWinner({ ids, campaignId, snsId })),
    onCancelWinner: (ids, campaignId, snsId) =>
      dispatch(cancelWinner({ ids, campaignId, snsId })),
    onUpdateClaim: (ids, campaignId, claimStatus, snsId) =>
      dispatch(changeClaimStatus({ ids, campaignId, claimStatus, snsId })),
    onSetData: (key, value) => dispatch(setData(key, value)),
    onResetData: () => dispatch(resetData()),
    onSubmit: async (values, onSubmitted) => {
      const [
        snsUsers,
        snsId,
        messageTemplateId,
        content,
        uploadFiles,
        campaignId,
      ] = values;
      let fileResp = uploadFiles.length > 0 ? uploadFiles[0] : null;
      if (uploadFiles && typeof uploadFiles[0] === 'string') {
        fileResp = fetch(`${config.API_URL}/images?filename=${uploadFiles[0]}`)
          .then(newResp =>
            newResp && newResp.status === 404 ? null : newResp.blob(),
          )
          .then(blob =>
            blob !== null
              ? new File([blob], `image.${blob.type.substring(6)}`, {
                type: blob.type,
              })
              : null,
          );
      }
      dispatch(
        sendMessage(
          {
            snsUsers,
            snsId,
            messageTemplateId,
            content,
            file: await fileResp,
            campaignId,
          },
          onSubmitted,
        ),
      );
    },
    onSubmitDetails: (values, onSubmitted) => {
      dispatch(changeWinnerInfo(values, onSubmitted));
    },
    onError: data => dispatch(setErrors(data)),
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
)(ParticipantDetailPage);
