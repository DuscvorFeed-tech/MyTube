/* eslint-disable no-empty */
/* eslint-disable prettier/prettier */
/**
 *
 * CampaignDetailPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { injectIntl, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withTheme } from 'styled-components';

import Tabs from 'components/Tabs';
import TabsWrapper from 'components/Tabs/Wrapper';
import Card from 'components/Card';
import Button from 'components/Button';
import LoadingIndicator from 'components/LoadingIndicator';
import { modalToggler } from 'utils/commonHelper';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { config } from 'utils/config';
import { PathEnum } from 'library/commonValues';

import Details from './subcomponents/View/Details';
import Prize from './subcomponents/View/PrizeDistribution';
import Chart from './subcomponents/View/Chart';
import EntryList from './subcomponents/View/EntryList';
import Winner from './subcomponents/View/Winner';
import ForceStopModal from './subcomponents/ForceStop';
import SuccessMessageModal from './subcomponents/SuccessMessage';

import makeSelectCampaignDetailPage from './selectors';
import reducer from './reducer';
import messages from './messages';
import saga from './saga';
import {
  setData,
  resetData,
  getTemplate,
  getWinnerList,
  getCampDetails,
  generateWinner,
  cancelWinner,
  selectWinner,
  changeClaimStatus,
  getPrizeDistribution,
  downloadCsv,
  forceEnd,
  sendDM,
  getStats,
  addPostLink,
  backFill,
  uploadCsv
} from './actions';
import { BackFill } from './subcomponents/BackFill';
const { STAGING_CONTENT } = NOCONTENT;

export function CampaignDetailPage(props) {
  useInjectReducer({ key: 'campaignDetailPage', reducer });
  useInjectSaga({ key: 'campaignDetailPage', saga });

  const [showFlow, setShowFlow] = useState(1);
  const [isGenerate, setIsGenerate] = useState(false);
  const [isForceStop, setIsForceStop] = useState(false);
  const [isBackfill, setIsBackFill] = useState(false);
  const [disableBackfill, setDisableBackfillBtn] = useState(false);
  const [showLoadingIndicator] = useState(false);

  const {
    intl,
    onSetData,
    onGetWinnerList,
    onGetCampDetails,
    onGetPrizeDist,
    onGetStats,
    onGenerateWinner,
    onResetData,
    onSelectWinner,
    userAccount,
    onForceEnd,
    onBackFill,
    commonTypes,
    detailPage: {
      tab,
      campDetails,
      // cancelledWinner,
      errors,
      newCampPrize,
      listOfPrizes,
      disabledFS,
      backfill,
      csvFileUploaded,
      winnerList,
    },
    location,
    onAddPostLink,
  } = props;

  const { CampaignStatus } = props.commonTypes;

  const snsType = userAccount.primary.type;

  const id = Number(props.routeParams.id);

  const snsAccountId = userAccount.primary.id;

  const [filter, setFilter] = useState({
    start_period: '',
    end_period: '',
    prize_id: null,
    claim_status: null,
    entry_status: null,
    form_status: null,
  });

  const [orderBy, setOrderBy] = useState({});

  const [checkedList] = useState([]);

  const [checkedParticipant, setCheckedParticipant] = useState({
    list: [],
  });

  const [checkCondition, setCheckCondition] = useState({
    list: [],
  });

  const [uncheckParticipant, setUncheckParticipant] = useState({
    list: [],
  });

  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    onResetData();
    if (
      location.pathInfo &&
      location.pathInfo.backUrl === PathEnum.Participant
    ) {
      onSetData('tab', 4);
    }
    onGetCampDetails(id, snsAccountId);
    // Entry list get initial total records
    onGetWinnerList({ ...{initial: true}, id }, true);
  }, []);

  useEffect(() => {
    if (tab === 1) {
      onGetCampDetails(id, snsAccountId);
    } else if (tab === 2) {
      onGetStats({
        campaignId: [Number(id)],
        snsId: userAccount.primary.id,
        dateStart: '',
        dateEnd: '',
      });
    } else if (tab === 3) {
      onGetPrizeDist(id, snsAccountId);
    } else if (tab === 4) {
      onGetWinnerList({ ...filter, id }, true);
    }
  }, [tab, filter]);

  useEffect(() => {
    const { followersSort, followedSort, entryDateSort } = orderBy;
    onGetWinnerList({ ...filter, id, followersSort, followedSort, entryDateSort }, true);
  }, [orderBy]);

  useEffect(() => {
    setDisableBackfillBtn(false);
  }, [backfill]);

  const onPageWinner = page => {
    const { followersSort, followedSort, entryDateSort } = orderBy;
    const status = campDetails && [0, 2].includes(Number(campDetails.status));

    const foundSelectAllIsSelected = checkCondition.list.find(p => p === 'selectAllIsSelected');
    const foundUncheckAllParticipantsOnPage = checkCondition.list.find(p => p === `uncheckAllParticipantsOnPage${page}`);
    const foundUseCustomSelectOnPage = checkCondition.list.find(p => p === `useCustomSelectOnPage${page}`);

    const checkedIds = checkedParticipant.list;    
    let selectAllParticipants = false;

    if(foundSelectAllIsSelected){

      if(foundUncheckAllParticipantsOnPage === undefined && foundUseCustomSelectOnPage === undefined){
        selectAllParticipants = true;
      }
      
    }

    onGetWinnerList({ ...filter, id, followersSort, followedSort, entryDateSort }, status, page, checkedIds, selectAllParticipants);    

  };

  const setForceEnd = (password, onSubmitted) => {
    setIsForceStop(true);
    onForceEnd(
      { password, id, snsId: snsAccountId },
      { cancelledWinner: campDetails.forceStopRemWinners, isGenerate },
      onSubmitted,
    );
  };

  const loadStats = dateFil => {
    onGetStats({
      campaignId: [Number(id)],
      snsId: userAccount.primary.id,
      ...dateFil,
    });
  };

  const applyBackFill = () => {
    setDisableBackfillBtn(true)
    onBackFill(Number(id));
  };

  const onClickOkSuccess = () => {
    setIsForceStop(false);
    setIsBackFill(false);
  }

  const onCancelResetList = () => {
    const page = winnerList && winnerList.pageInfo && winnerList.pageInfo.currentPage;
    const { followersSort, followedSort, entryDateSort } = orderBy;
    onGetWinnerList({ ...filter, id, followersSort, followedSort, entryDateSort }, true, page);
  }

  const onSelectWinnerResetList = (ids, campaignId, snsId) => {
    const page = winnerList && winnerList.pageInfo && winnerList.pageInfo.currentPage;
    const { followersSort, followedSort, entryDateSort } = orderBy;
    const data = { ...filter, id, followersSort, followedSort, entryDateSort, page };
    onSelectWinner(ids, campaignId, snsId, data);
  }

  return (
    <div>
      <Helmet>
        <title>{campDetails && campDetails.title}</title>
        <meta
          name="description"
          content="Description of Campaign Detail Page"
        />
      </Helmet>
      {campDetails && (
        <ForceStopModal
          showFlow={showFlow}
          setShowFlow={setShowFlow}
          isGenerate={isGenerate}
          setIsGenerate={setIsGenerate}
          onGenerateWinner={onGenerateWinner}
          detailPage={props.detailPage}
          intl={props.intl}
          onForceEnd={setForceEnd}
          errors={errors}
        />
      )}

      <Card
        title={campDetails && campDetails.title}
        subTitle={
          <React.Fragment>
            <span className="text-uppercase">
              {intl.formatMessage({ ...messages.status })}:{' '}
            </span>
            <span className="text-success font-weight-bold">
              {CampaignStatus &&
                campDetails &&
                CampaignStatus.filter(t => t.value === campDetails.status).map(
                  t =>
                    intl.formatMessage(
                      { id: `campaignStatus${t.value}` },
                      { defaultMessage: t.name },
                    ),
                )}
            </span>
          </React.Fragment>
        }
        component={
          <div className="row align-items-center justify-content-end">
            <div className="text-uppercase col-auto">
              <Button
                red
                small
                className="text-uppercase"
                width="sm"
                dataDismiss="modal"
                disabled={
                  campDetails &&
                  (disabledFS || ![0, 1].includes(Number(campDetails.status)))
                }
                onClick={() => {
                  setShowFlow(1);
                  setIsGenerate(false);
                  setIsForceStop(false);
                  setIsBackFill(false);
                  modalToggler('forceStop');
                }}
              >
                {intl.formatMessage({ ...messages.forceStop })}
              </Button>
            </div>
            <div className="text-uppercase col-auto">
              <Button
                red
                small
                className="text-uppercase"
                width="sm"
                dataDismiss="modal"
                disabled={
                  snsType === 2 || disableBackfill || ![0, 2].includes(Number(campDetails.status))
                }
                onClick={() => {
                  setShowFlow(1);
                  setIsGenerate(false);
                  setIsForceStop(false);
                  setIsBackFill(true);
                  modalToggler('backFill');
                }}
              >
                {intl.formatMessage({ ...messages.backFill })}
              </Button>
            </div>
          </div>
        }
      >
        <div className="row border-bottom">
          <div className="col-7">
            <TabsWrapper className="justify-content-around equal">
              <Tabs
                id="flow1"
                className={tab === 1 && 'active'}
                label={intl.formatMessage({ ...messages.T0000007 })}
                onClick={() => onSetData('tab', 1)}
              />
              {/* Temporary Removed Campaign Chart */}
              {!STAGING_CONTENT && snsType === 1 && (
                <Tabs
                  id="flow2"
                  className={tab === 2 && 'active'}
                  label={intl.formatMessage(
                    { id: 'T0000004' },
                    { name: 'Chart' },
                  )}
                  onClick={() => onSetData('tab', 2)}
                />
              )}
              <Tabs
                id="flow3"
                className={tab === 3 && 'active'}
                label={intl.formatMessage({ ...messages.T0000008 })}
                onClick={() => onSetData('tab', 3)}
              />
              <Tabs
                id="flow2"
                className={tab === 4 && 'active'}
                label={intl.formatMessage({ ...messages.T0000037 })}
                onClick={() => onSetData('tab', 4)}
              />
              {false && (
                <Tabs
                  id="flow2"
                  className={tab === 5 && 'active'}
                  label="Winner"
                  onClick={() => onSetData('tab', 5)}
                />
              )}
            </TabsWrapper>
          </div>
        </div>
        {tab === 1 && (
          <Details
            detailPage={props.detailPage}
            {...props}
            userAccount={userAccount}
            location={location}
            onAddPostLink={() => onAddPostLink(props.detailPage.campDetails.id, snsType)}
          />
        )}
        {tab === 2 && (
          <Chart
            intl={intl}
            theme={props.theme}
            detailPage={props.detailPage}
            loadStats={loadStats}
          />
        )}
        {tab === 3 && (
          <Prize campDetails={newCampPrize} listOfPrizes={listOfPrizes} />
        )}
        {tab === 4 && (
          <EntryList
            isForceStop={isForceStop}
            detailPage={props.detailPage}
            {...props}
            id={id}
            onPageWinner={onPageWinner}
            filter={filter}
            setFilter={setFilter}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            checkedList={checkedList}
            statusList={{
              type: intl.formatMessage({
                ...messages.participantStatus,
              }),
              listType: 'entryStatus',
              data: commonTypes && commonTypes.EntryStatus,
            }}
            statusList2={{
              type: intl.formatMessage({
                ...messages.claimStatus,
              }),
              listType: 'claimStatus',
              data: commonTypes && commonTypes.ClaimStatus,
            }}
            statusList3={{
              type: intl.formatMessage({
                ...messages.formStatus,
              }),
              listType: 'formStatus',
              data: commonTypes && commonTypes.FormStatus,
            }}
            prizeList={{
              name: intl.formatMessage({
                ...messages.prize,
              }),
              data: campDetails.campaign_prize,
            }}
            csvFileUploaded={csvFileUploaded}
            checkedParticipant={checkedParticipant}
            setCheckedParticipant={setCheckedParticipant}
            checkCondition={checkCondition}
            setCheckCondition={setCheckCondition}
            uncheckParticipant={uncheckParticipant}
            setUncheckParticipant={setUncheckParticipant}
            backfillMessage={isBackfill}
            onClickOkSuccess={onClickOkSuccess}
            onCancelResetList={onCancelResetList}
            onSelectWinner={onSelectWinnerResetList}
            isDownloading={isDownloading}
            setIsDownloading={setIsDownloading}
          />
        )}
        {tab === 5 && <Winner />}
      </Card>
      {showLoadingIndicator && <LoadingIndicator />}
      <SuccessMessageModal
        forceStopMessage={isForceStop}
        backfillMessage={isBackfill}
        campDetails={campDetails}
        onSetData={onSetData}
        onClickOkSuccess={onClickOkSuccess}
      />
      <BackFill
        intl={props.intl}
        applyBackFill={applyBackFill}
      />
    </div>
  );
}

CampaignDetailPage.propTypes = {
  intl: intlShape.isRequired,
  theme: PropTypes.object,
  detailPage: PropTypes.any,
  onSetData: PropTypes.any,
  onGetWinnerList: PropTypes.any,
  onGetCampDetails: PropTypes.any,
  onResetData: PropTypes.any,
  onGenerateWinner: PropTypes.any,
  onCancelWinner: PropTypes.func,
  onSelectWinner: PropTypes.func,
  routeParams: PropTypes.any,
  commonTypes: PropTypes.object,
  userAccount: PropTypes.any,
  onForceEnd: PropTypes.func,
  onGetPrizeDist: PropTypes.func,
  onSendDM: PropTypes.func,
  onGetStats: PropTypes.func,
  location: PropTypes.any,
  onAddPostLink: PropTypes.func,
  onBackFill: PropTypes.any,
  onUploadCsv: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  detailPage: makeSelectCampaignDetailPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetTemplate: id => {
      if (id) {
        dispatch(getTemplate(id));
      }
    },
    onGetWinnerList: (data, callDetail, page = 1, ids, selectAllParticipants) =>
      dispatch(getWinnerList({ ...data, page }, callDetail, ids, selectAllParticipants)),
    onGetCampDetails: (id, snsId, page = 1) =>
      dispatch(getCampDetails({ id, snsId, page })),
    onGetPrizeDist: (id, snsId) =>
      dispatch(getPrizeDistribution({ id, snsId })),
    onGenerateWinner: (id, count, snsId, forceStop = false) =>
      dispatch(generateWinner({ id, count, snsId, forceStop })),
    onSelectWinner: (ids, campaignId, snsId, dataEntries) =>
      dispatch(selectWinner({ ids, campaignId, snsId }, dataEntries)),
    onCancelWinner: (ids, campaignId, dataEntries) =>
      dispatch(cancelWinner({ ids, campaignId, dataEntries })),
    onUpdateClaim: (ids, campaignId, claimStatus, snsId) =>
      dispatch(changeClaimStatus({ ids, campaignId, claimStatus, snsId })),
    onSetData: (key, value) => dispatch(setData(key, value)),
    onDownload: (data, setFlag) => {
      if (window.EventSource) {
        const eventSource = new EventSource(`${config.DOWNLOAD_EVENTS}?pid=${data.id}`);
        eventSource.onmessage = e => {
          try {
            const event = JSON.parse(e.data);
            if(event.duplicated || event.filename) {
              eventSource.close();
            }
            if(event.id) {
              dispatch(downloadCsv({...data, downloadId: event.id}));
              setFlag(true);
            }
            if(event.filename) {
              const a = document.createElement('a');
              a.href = `${config.DOWNLOAD_CSV_URL}?filename=${encodeURIComponent(
                event.filename.replace('.csv', ''),
              )}`;
              document.body.appendChild(a);
              a.click();
              setFlag(false);
            }
          }catch {}
        }
      } else {
        dispatch(downloadCsv(data))
      }
    },
    onResetData: () => dispatch(resetData()),
    onBackFill: (id) => dispatch(backFill(id)),
    onForceEnd: (stop, generate, onSubmitted) =>
      dispatch(forceEnd({ ...stop, generate }, onSubmitted)),
    onSendDM: async (values, onSubmitted) => {
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
        sendDM(
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
    onGetStats: data => dispatch(getStats(data)),
    onAddPostLink: (campaignId, snsType) => dispatch(addPostLink(campaignId, snsType)),
    onUploadCsv: async (values, onSubmitted) => {
      const [
        campaignId,
        snsId,
        csvFile,
      ] = values;

      dispatch(
        uploadCsv(
          {
            campaignId, 
            snsId, 
            csvFile
          },
          onSubmitted,
        ),
      );
    },
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
)(CampaignDetailPage);
