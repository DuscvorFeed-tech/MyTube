/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { formatMessage, injectIntl, intlShape } from 'react-intl';
import Button from 'components/Button';
// import Tags from 'components/Tags';
import Select from 'components/Select';
import Search from 'components/Search';
import Checkbox from 'components/Checkbox';
import TableList from 'components/TableList';
import ListContent from 'components/TableList/ListContent';
import Pager from 'components/Pager';
import Input from 'components/Input';
import Textarea from 'components/Textarea';
import Label from 'components/Label';
import IcoFont from 'react-icofont';
import Modal from 'components/Modal';
import Filter from 'components/Filter';
import ErrorFormatted from 'components/ErrorFormatted';
import OrderByNumeric from 'components/OrderByNumeric';
import OrderByAlphabet from 'components/OrderByAlphabet';
import OrderByDefault from 'components/OrderByDefault';

import ModalToggler from 'components/Modal/ModalToggler';

import { forwardTo } from 'helpers/forwardTo';
import { modalToggler, countRecord } from 'utils/commonHelper';
import { config } from 'utils/config';

import useValidation, { isValid } from 'library/validator';
import validation from '../../validators';

// subcomponents
import SendMessageModal from '../SendMessage';
import ClaimStatusModal from '../ClaimStatus';
import ParticipantStatusModal from '../ParticipantStatus';
import SuccessMessageModal from '../SuccessMessage';
import FailedEntryModal from '../FailedMessage';
import LoseFlowModal from '../LoseFlow';
import GenerateNewWinner from '../GenerateNewWinner';
import UploadCsvModal from '../UploadCsv';
import FailedUploadCsvModal from '../FailedUploadCsv';

import messages from '../../messages';
import { useUploadFile, PublishTwitterState } from '../../inputStateEffect';

function EntryList({
  detailPage: {
    winnerList,
    winnerInitialListCount,
    campDetails,
    cancelledWinner,
    ids,
    generateMessage,
    errors,
    participantStatus,
    selectedValue,
    showFlow,
    templateList,
    failedEntries,
    statTotals,
    uncheckParticipantByPager,
  },
  commonTypes: { ClaimStatus, FormStatus, EntryStatus },
  onPageWinner,
  onGenerateWinner,
  onSelectWinner,
  onCancelWinner,
  onUpdateClaim,
  onResetData,
  onSetData,
  checkedList,
  onDownload,
  onGetCampDetails,
  intl,
  id,
  filter,
  setFilter,
  orderBy,
  setOrderBy,
  statusList,
  statusList2,
  statusList3,
  isForceStop,
  prizeList,
  onSendDM,
  userAccount,
  csv,
  onUploadCsv,
  csvFileUploaded,
  checkedParticipant,
  setCheckedParticipant,
  checkCondition,
  setCheckCondition,
  uncheckParticipant,
  setUncheckParticipant,
  backfillMessage,
  onClickOkSuccess,
  onCancelResetList,
  isDownloading,
  setIsDownloading,
}) {
  const snsType = userAccount.primary.type;
  const snsId = userAccount.primary.id;
  const validator = validation(intl);
  const winner = useValidation('', validator.winner(cancelledWinner));

  const csvFile = useValidation('', validator.csvFile);

  const invalid = !isValid([winner]);

  const [state, setState] = useState({ checkedList });

  const [effectClear, setEffectClear] = useState(0);

  const { raffle_type, status } = campDetails;

  const total = (winnerList && winnerList.pageInfo) ? winnerList.pageInfo.totalRecords : 0;
  const currentPageIndex = ((winnerList && winnerList.pageInfo && winnerList.pageInfo.currentPage) || 1) - 1;

  const specialCond =
    (status === 2 && (raffle_type === 2 || raffle_type === 3)) ||
    (status === 0 && raffle_type === 3);

  const setSelectedValue = e => {
    const x = e.target.value;
    onSetData('selectedValue', Number(x));
  };

  const setParticipantStatus = e => {
    const x = e.target.value;
    onSetData('participantStatus', Number(x));
  };

  const onChecked = (e, itm) => {

    const foundSelectAllIsSelected = checkCondition.list.find(p => p === 'selectAllIsSelected');
    if(foundSelectAllIsSelected){

      if(uncheckParticipant.list.length === 0){

        const foundUncheckAllParticipantsOnPage = checkCondition.list.find(p => p === `uncheckAllParticipantsOnPage${winnerList.pageInfo.currentPage}`);
        if(foundUncheckAllParticipantsOnPage === undefined){

          winnerList.list.forEach(item => {

            const foundUncheckedParticipant = uncheckParticipant.list.find(p => p === item.id);
            if(foundUncheckedParticipant === undefined){

              const foundCheckedParticipant = checkedParticipant.list.find(p => p.id === item.id);
              if(foundCheckedParticipant === undefined){
                
                checkedParticipant.list.push(item);
                state.checkedList.push(item);

              }

            }  
  
          });  

        }

      } else {

        winnerList.list.forEach(item => {

          const foundUncheckedParticipant = uncheckParticipant.list.find(p => p === item.id);
          if(foundUncheckedParticipant === undefined){
            
            const foundCheckedParticipant = checkedParticipant.list.find(p => p.id === item.id);
            if(foundCheckedParticipant === undefined){
              
              checkedParticipant.list.push(item);
              state.checkedList.push(item);

            }
            
          }  

        });

      }

    }

    if (e.checked) {
      
      const uncheckParticipantIndex = uncheckParticipant.list.indexOf(itm.id);
      if(uncheckParticipantIndex > -1){
        uncheckParticipant.list.splice(uncheckParticipantIndex, 1);
      }

      const foundCheckedParticipant = checkedParticipant.list.find(p => p.id === itm.id);
      if(foundCheckedParticipant === undefined){
        checkedParticipant.list.push(itm);
        state.checkedList.push(itm);
      }

      const index = checkCondition.list.indexOf(`uncheckAllParticipantsOnPage${winnerList.pageInfo.currentPage}`);
      if(index > -1){
        checkCondition.list.splice(index, 1);
      }

      if(uncheckParticipantByPager) {
        const result = uncheckParticipantByPager[currentPageIndex].filter(s => s.id !== itm.id);
        setUncheckParticipantByPager(result);
      }

    } else {

      state.checkedList = state.checkedList.filter(item => item.id !== itm.id);

      const foundUncheckParticipant = uncheckParticipant.list.find(p => p === itm.id);
      if(foundUncheckParticipant === undefined){
        uncheckParticipant.list.push(itm.id);
      }
      
      // eslint-disable-next-line no-param-reassign
      checkedParticipant.list = checkedParticipant.list.filter(item => item.id !== itm.id);

      if(uncheckParticipantByPager) {
        uncheckParticipantByPager[currentPageIndex].push(itm);
        setUncheckParticipantByPager(uncheckParticipantByPager[currentPageIndex]);
      }
    }

    const customSelect = checkCondition.list.find(p => p === `useCustomSelectOnPage${winnerList.pageInfo.currentPage}`);
    if(customSelect === undefined){
      checkCondition.list.push(`useCustomSelectOnPage${winnerList.pageInfo.currentPage}`)
    }

    setCheckedParticipant(prev => ({ ...prev, list: checkedParticipant.list }));  
    setUncheckParticipant(prev => ({ ...prev, list: uncheckParticipant.list }));
    setCheckCondition(prev => ({ ...prev, list: checkCondition.list }));
    setState(prev => ({ ...prev, checkedList: state.checkedList }));

    onSetData('ids', checkedParticipant.list);
    onSetData('selectedValue', 0);

  };

  const isAllSelected = () => {
    for (let i = 0; i < winnerList.list.length; i += 1) {
      const itm = winnerList.list[i];
      if (!ids.find(t => t.id === itm.id)) {
        return false;
      }
    }
    return true;
  };

  const onCheckedAll = e => {

    winnerList.list.forEach(itm => {
      if (ids.find(t => t.id === itm.id)) {
        
        if (!e.checked) {
          
          // eslint-disable-next-line no-param-reassign
          state.checkedList = state.checkedList.filter(item => item.id !== itm.id);
          // eslint-disable-next-line no-param-reassign
          checkedParticipant.list = checkedParticipant.list.filter(item => item.id !== itm.id);

          if (uncheckParticipant.list.find(p => p === itm.id) === undefined) {
            uncheckParticipant.list.push(itm.id);
          }

        } else {

          if (checkedParticipant.list.find(p => p.id === itm.id) === undefined) {
            checkedParticipant.list.push(itm);
          }

          const uncheckParticipantIndex = uncheckParticipant.list.indexOf(itm.id);
          if(uncheckParticipantIndex > -1){
            uncheckParticipant.list.splice(uncheckParticipantIndex, 1);
          }

        }

      } else if (e.checked) {

        state.checkedList.push(itm);

        if (checkedParticipant.list.find(p => p.id === itm.id) === undefined) {
          checkedParticipant.list.push(itm);
        }

        const uncheckParticipantIndex = uncheckParticipant.list.indexOf(itm.id);
        if(uncheckParticipantIndex > -1){
          uncheckParticipant.list.splice(uncheckParticipantIndex, 1);
        }

      }

    });

    if(!e.checked){

      const foundUncheckAllParticipantsOnPage = checkCondition.list.find(p => p === `uncheckAllParticipantsOnPage${winnerList.pageInfo.currentPage}`);
      if(foundUncheckAllParticipantsOnPage === undefined){
        checkCondition.list.push(`uncheckAllParticipantsOnPage${winnerList.pageInfo.currentPage}`)
      }

      setUncheckParticipantByPager(Array.from(winnerList.list));

    } else {

      const index = checkCondition.list.indexOf(`uncheckAllParticipantsOnPage${winnerList.pageInfo.currentPage}`);
      if(index > -1){
        checkCondition.list.splice(index, 1);
      }
      
      setUncheckParticipantByPager([]);

    }

    setCheckedParticipant(prev => ({ ...prev, list: checkedParticipant.list }));
    setUncheckParticipant(prev => ({ ...prev, list: uncheckParticipant.list }));
    setCheckCondition(prev => ({ ...prev, list: checkCondition.list }));
    setState(prev => ({ ...prev, checkedList: state.checkedList }));

    onSetData('ids', checkedParticipant.list);
    onSetData('selectedValue', 0);
  };

  const checkClaimStatus = () => {
    const hasLose = ids.find(l => Number(l.entry_status) !== 1);
    const hasPending = ids.find(c => c.claimed === 0);
    const hasDelivered = ids.find(c => c.claimed === 1);
    const hasClaimed = ids.find(c => c.claimed === 2);
    // const hasCancelled = ids.find(c => c.claimed === 3);
    if (hasLose) {
      return true;
    }
    if (
      (hasPending && hasDelivered) ||
      (hasPending && hasClaimed) ||
      (hasDelivered && hasClaimed)
    ) {
      return true;
    }
    return false;
  };

  const checkSendMsg = () => {
    const hasWin = ids.find(w => Number(w.entry_status) === 1);
    const hasLose = ids.find(l => Number(l.entry_status) !== 1);
    if (hasWin && hasLose) {
      return true;
    }
    return false;
  };

  const checkPartStatus = () => {
    const hasWin = ids.find(w => Number(w.entry_status) === 1);
    const hasLose = ids.find(l => Number(l.entry_status) !== 1);
    if ((hasWin && hasLose) || (hasLose && cancelledWinner === 0)) {
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
      ![0, 2, 4].includes(campDetails.status)
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

    // If Participant Status is loser, show blank
    if (entStatus === 0) {
      return '';
    }
    return stat;
  };

  const tweetUploadFile = useUploadFile(intl);
  const publishTwitterState = PublishTwitterState(intl);
  const { content } = publishTwitterState;
  const templateId = useValidation('');

  const applyBtn = () => {
    if (selectedValue === 1) {
      const checkWinner = state.checkedList.find(m => m.entry_status === 1);
      if (templateList && campDetails && checkWinner) {
        const tempId = templateList.find(
          itm => itm.id === Number(campDetails.winner_message_template.id),
        );
        if (tempId) {
          if (tempId.message_file !== null) {
            tweetUploadFile.setUploadFile([tempId.message_file]);
          } else {
            tweetUploadFile.setUploadFile([]);
          }
          content.setvalue(tempId.content);
          templateId.setvalue(campDetails.winner_message_template.id);
        } else {
          tweetUploadFile.setUploadFile([]);
          content.onClearValue('', true);
          templateId.onClearValue('', true);
        }
      } else {
        content.onClearValue('', true);
        templateId.onClearValue('', true);
      }
      modalToggler('modalTemplatePreview');
    } else if (selectedValue === 4) {
      const selectAllIsSelected = checkCondition.list.some(p => p === 'selectAllIsSelected');
      const { followersSort, followedSort, entryDateSort } = orderBy;
      if(selectAllIsSelected) {
        let exclude_sns_names = [];
        uncheckParticipantByPager.map(s => 
        {
          exclude_sns_names = [].concat(exclude_sns_names, s.map(d => d.sns_username)) 
          return exclude_sns_names;
        });

        onDownload({
          ...filter, 
          followersSort, 
          followedSort, 
          entryDateSort,
          id,
          exclude_sns_names,
          sns_names: [],
        }, setIsDownloading);
      } else {
        onDownload({
          ...filter,
          followersSort, 
          followedSort, 
          entryDateSort,
          id,
          exclude_sns_names: [],
          sns_names: state.checkedList.map(m => m.sns_username),
        }, setIsDownloading);
      }
    } else if (selectedValue === 5) {
      const { followersSort, followedSort, entryDateSort } = orderBy;
      onDownload({
        ...filter,
        followersSort, 
        followedSort, 
        entryDateSort,
        id,
        sns_names: [],
      }, setIsDownloading);
    } else if (selectedValue === 6) {
      if (csvFileUploaded && csvFileUploaded === true) {
        csvFile.setvalue();
      }
      modalToggler('modalTemplatePreview');
    } else if (selectedValue === 7) { // If "Select All"

      // eslint-disable-next-line no-param-reassign
      checkCondition.list = [];
      // eslint-disable-next-line no-param-reassign
      checkedParticipant.list = [];
      // eslint-disable-next-line no-param-reassign
      uncheckParticipant.list = [];

      if(winnerList && winnerList.pageInfo){
        onSetData('uncheckParticipantByPager', Array.from(
          Array(winnerList.pageInfo.totalPage),
        ).map(() => []));
      }

      checkCondition.list.push('selectAllIsSelected');

      winnerList.list.forEach(itm => {
        checkedParticipant.list.push(itm);
        state.checkedList.push(itm);
      });

      setCheckedParticipant(prev => ({ ...prev, list: checkedParticipant.list }));
      setCheckCondition(prev => ({ ...prev, list: checkCondition.list }));
      setState(prev => ({ ...prev, checkedList: state.checkedList }));
      onSetData('ids', checkedParticipant.list);

    } else {
      modalToggler('modalTemplatePreview');
    }
  };

  useEffect(() => {
    csvFile.setvalue(csv);
  }, [csv]);

  useEffect(() => {
    if(effectClear) {
      setCheckedParticipant({list: []});
      setUncheckParticipant({list: []});
      setCheckCondition({list: []});
      setState(prev => ({
        ...prev,
        checkedList: [],
      }));
    }
  }, [effectClear]);

  const resetUploadCsvFile = () => {
    csvFile.setvalue();
  };

  const onClickOkSuccessEntry = () => {
    onSetData('generateMessage', false);
    onClickOkSuccess();
  }

  const setUncheckParticipantByPager = list => {
    if(uncheckParticipantByPager) {
    // eslint-disable-next-line no-param-reassign
      uncheckParticipantByPager[currentPageIndex] = list;
      onSetData('uncheckParticipantByPager', uncheckParticipantByPager);
    }
  }

  const CheckNoSelected = () => {
    const selectAllIsSelected = checkCondition.list.some(p => p === 'selectAllIsSelected');

    if(selectAllIsSelected && uncheckParticipantByPager) {
      let noSelected = true;
      // eslint-disable-next-line no-restricted-syntax
      for(const item of uncheckParticipantByPager) {
        const result = !item.length || item.some(d => !d.sns_username);
        if(result) {
          noSelected = false;
          break;
        }
      }
      return noSelected;
    }

    return !ids.length;
  }

  return (
    <div>
      <div className="row mx-5 mt-5">
        <div className="col-4">
          <Search
            onChange={({ target }) =>
              setFilter(prev => ({ ...prev, username: target.value }))
            }
          />
        </div>
        <div className="col-3">
          <Filter
            statusList={statusList}
            statusList2={statusList2}
            statusList3={statusList3}
            prizeList={prizeList}
            dateFilter={{show: snsType === 1, messages: messages.entryPeriod}}
            onSubmitFilter={dataFil => {
              const sp = dataFil.state[0]
                ? moment(dataFil.state[0]).format('MM/DD/YYYY')
                : null;
              const ep = dataFil.state[1]
                ? moment(dataFil.state[1]).format('MM/DD/YYYY')
                : null;
              const es = dataFil.status ? Number(dataFil.status) : null;
              const cs = dataFil.status2 ? Number(dataFil.status2) : null;
              const fs = dataFil.status3 ? Number(dataFil.status3) : null;
              const prize = dataFil.prize ? Number(dataFil.prize) : null;
              const sfi = dataFil.formPeriodState[0]
                ? moment(dataFil.formPeriodState[0]).format('MM/DD/YYYY')
                : null;
              const efi = dataFil.formPeriodState[1]
                ? moment(dataFil.formPeriodState[1]).format('MM/DD/YYYY')
                : null;
              setFilter(prev => ({
                ...prev,
                entry_status: es,
                claim_status: cs,
                form_status: fs,
                prize_id: prize,
                start_period: sp,
                end_period: ep,
                fi_start_period: sfi,
                fi_end_period: efi,
              }));
              setOrderBy({});
              setCheckCondition(prev => ({ ...prev, list: [] }));
            }}
            onClear={() => {
              setFilter(prev => ({
                ...prev,
                entry_status: null,
                claim_status: null,
                form_status: null,
                prize_id: null,
                start_period: null,
                end_period: null,
              }));
            }}
          />
        </div>
      </div>
      <div className="row mx-5 p-2">
        <div className="col-auto m-0 p-0">
          {/* <Tags text="winning entries" /> */}
        </div>
        <div className="col-auto m-0 p-0">{/* <Tags text="pending" /> */}</div>
      </div>
      <div className="row mx-5">
        <div className="col-auto ml-auto">
          <Button
            link
            disabled={!specialCond || cancelledWinner === 0}
            className="dark underline"
            onClick={() => {
              winner.onClearValue('');
              modalToggler('modalGenerateNewWinner');
            }}
          >
            {intl.formatMessage({
              ...messages.generateWinner,
            })}
          </Button>
        </div>
      </div>
      <div className="row mx-5 pb-2">
        <div className="col-auto text-muted pt-2">
          {intl.formatMessage(
            { id: 'M0000004' },
            {
              pageNumber: total,
              totalPage: statTotals.grandTotalUniqueEntries,
              entryPosts: statTotals.grandTotalEntries,
            },
          )}
          {/* Results: {countRecord(winnerList)} of {total} records found */}
        </div>
        {/* {snsType === 1 && ( */}
        {/*  <div className="col-auto ml-auto"> */}
        {/*    <Button */}
        {/*      link */}
        {/*      className="danger underline" */}
        {/*      onClick={() => */}
        {/*        onDownload({ */}
        {/*          ...filter, */}
        {/*          id, */}
        {/*          sns_names: state.checkedList.map(m => m.sns_username), */}
        {/*        }) */}
        {/*      } */}
        {/*    > */}
        {/*      {intl.formatMessage({ */}
        {/*        ...messages.downloadCSV, */}
        {/*      })} */}
        {/*    </Button> */}
        {/*  </div> */}
        {/* )} */}
      </div>
      <div className="row mx-5">
        <div className="col">
          {errors && <ErrorFormatted invalid list={[errors]} />}
          <TableList header bgGray align="center">
            <ListContent align="left" hasCheckbox>
              <Checkbox
                checked={winnerList && isAllSelected()}
                onChange={e => onCheckedAll(e.target)}
              />
            </ListContent>
            <ListContent align="left">
              {intl.formatMessage({
                ...messages.username,
              })}
            </ListContent>
            <ListContent align="left">
              {intl.formatMessage({
                ...messages.followers,
              })}
              <Button
                link
                dataToggle="tooltip"
                dataPlacement="top"
                title={intl.formatMessage({
                  ...messages.followertooltip,
                })}
                className="header-toolbtn"
              >
                <IcoFont
                  className="cursorPointer active"
                  icon="icofont-info-circle"
                  style={{
                    lineHeight: '0',
                    margin: '0 3px',
                    fontSize: '0.8rem',
                  }}
                />
              </Button>
              <OrderByNumeric activeIcon={orderBy.followersIcon} onClick={e => setOrderBy({followersSort: e.sort, followersIcon: e.activeIcon}) } />
            </ListContent>
            <ListContent align="left">
              {intl.formatMessage({
                ...messages.followed,
              })}
              <OrderByAlphabet activeIcon={orderBy.followedIcon} onClick={e => setOrderBy({followedSort: e.sort, followedIcon: e.activeIcon}) } />
            </ListContent>
            {snsType === 2 && (
              <ListContent align="left">
                {intl.formatMessage({
                  ...messages.liked,
                })}
              </ListContent>
            )}
            <ListContent align="left">
              {intl.formatMessage({
                ...messages.dateOfEntry,
              })}
              <OrderByDefault activeIcon={orderBy.entryDateIcon} onClick={e => setOrderBy({entryDateSort: e.sort, entryDateIcon: e.activeIcon}) } />
            </ListContent>
            <ListContent align="left">
              {intl.formatMessage({
                ...messages.participantStatus,
              })}
            </ListContent>
            <ListContent align="left">
              {intl.formatMessage({
                ...messages.claimStatus,
              })}
            </ListContent>
            <ListContent align="left">
              {intl.formatMessage({
                ...messages.formStatus,
              })}
            </ListContent>
            <ListContent align="left">
              {intl.formatMessage({
                ...messages.formInputDate,
              })}
            </ListContent>
            <ListContent align="left">
              {intl.formatMessage({
                ...messages.prize,
              })}
            </ListContent>
            <ListContent align="left">
              {intl.formatMessage({
                ...messages.numberOfDm,
              })}
            </ListContent>
            <ListContent />
          </TableList>
          {campDetails &&
            winnerList &&
              winnerList.list.map(itm => (
                <TableList
                  align="center"
                  className="font-weight-bold"
                  key={itm.id}
                >
                  <ListContent align="left" hasCheckbox>
                    <Checkbox
                      checked={Boolean(ids.find(t => t.id === itm.id))}
                      onChange={e => onChecked(e.target, itm)}
                    />
                  </ListContent>
                  <ListContent align="left">
                    <Button
                      link
                      // delete disabled for INSTA when username is fixed
                      onClick={() =>
                        window.open(
                          snsType === 1
                            ? `${config.TWITTER_URL}/${itm.sns_username}`
                            : snsType === 2
                              ? `${config.INSTAGRAM_URL}/${itm.sns_username}`
                              : `${config.TIKTOK_URL}/@${itm.sns_username}`,
                        )
                      }
                    >
                      {itm.sns_username}
                    </Button>
                  </ListContent>
                  <ListContent align="left">{itm.followers_count}</ListContent>
                  <ListContent align="left">
                    {itm.followed === 1 &&
                    intl.formatMessage({
                      ...messages.follow,
                    })}
                  </ListContent>
                  {snsType === 2 && (
                    <ListContent align="left">
                      {itm.liked === 1 &&
                      intl.formatMessage({
                        ...messages.like,
                      })}
                    </ListContent>
                  )}
                  <ListContent align="left">
                    {itm.entry_date} <br />
                    <small className="text-muted" />
                  </ListContent>
                  <ListContent align="left">
                    {checkEntStatus(
                      moment(itm.entry_date, 'MMM/DD/YYYY hh:mm A'),
                      itm.entry_status,
                    )}
                    <br />
                    <small className="text-muted" />
                  </ListContent>
                  <ListContent align="left">
                    {itm.entry_status !== 0 &&
                    ClaimStatus &&
                    intl.formatMessage({
                      id: `claimStatus${itm.claimed}`,
                      defaultMessage: ClaimStatus.find(
                        f => f.value === itm.claimed,
                      ).name,
                    })}
                  </ListContent>
                  <ListContent align="left">
                    {itm.entry_status !== 0 &&
                    FormStatus &&
                    intl.formatMessage({
                      id: `formStatus${itm.form_status}`,
                      defaultMessage: FormStatus.find(
                        f => f.value === itm.form_status,
                      ).name,
                    })}
                  </ListContent>
                  <ListContent align="left">
                    {itm.form_submission_date} <br />
                    <small className="text-muted" />
                  </ListContent>
                  <ListContent align="left">{itm.prize_name}</ListContent>
                  <ListContent align="left">{itm.dm_count}</ListContent>
                  <ListContent>
                    <Button
                      link
                      onClick={() =>
                        forwardTo(`/campaign/participant/detail/${id}/${itm.id}`)
                      }
                    >
                      <u>
                        {intl.formatMessage({
                          ...messages.viewDetails,
                        })}
                      </u>
                    </Button>
                  </ListContent>
                </TableList>
              ))}
        </div>
      </div>
      <div className="row mx-5 mt-5">
        <div className="col-3 pr-0">
          <Select
            onChange={e => setSelectedValue(e)}
            value={selectedValue}
            // disabled={ids.length === 0}
          >
            <option value="0">
              {intl.formatMessage({
                ...messages.chooseAction,
              })}
            </option>
            <option value="7">
              {intl.formatMessage({
                ...messages.selectAll,
              })}
            </option>
            {snsType === 1 && (
              <option value="1" disabled={checkSendMsg()}>
                {intl.formatMessage({
                  ...messages.sendMessage,
                })}
              </option>
            )}
            <option value="3" disabled={checkPartStatus()}>
              {intl.formatMessage({
                ...messages.changePStatus,
              })}
            </option>
            <option value="2" disabled={checkClaimStatus()}>
              {intl.formatMessage({
                ...messages.changeCStatus,
              })}
            </option>
            <option value="4">
              {intl.formatMessage({
                ...messages.downloadSelectedCSV,
              })}
            </option>
            <option value="5">
              {intl.formatMessage({
                ...messages.downloadAllCSV,
              })}
            </option>
            <option value="6">
              {intl.formatMessage({
                ...messages.uploadCSV,
              })}
            </option>
          </Select>
        </div>
        <div className="col-auto">
          <Button
            width="sm"
            primary
            small
            disabled={
              selectedValue === 0 ||
              (CheckNoSelected() &&
                !([5,6,7].includes(selectedValue)))
            }
            onClick={() => applyBtn()}
          >
            {intl.formatMessage({
              ...messages.apply,
            })}
          </Button>
        </div>
        <div className="col">
          {winnerList && winnerList.pageInfo && (
            <Pager
              align="justify-content-end"
              totalPage={winnerList.pageInfo.totalPage}
              currentPage={winnerList.pageInfo.currentPage}
              onPageChange={onPageWinner}
            />
          )}
        </div>
        {/* <Form2 isEdit className="mx-5"/> */}
        {selectedValue === 1 && (
          <SendMessageModal
            checkedList={state.checkedList}
            onSubmit={onSendDM}
            intl={intl}
            campaignId={id}
            errors={errors}
            userAccount={userAccount}
            templateList={templateList}
            tweetState={{ tweetUploadFile, content, templateId }}
          />
        )}
        {selectedValue === 2 && (
          <ClaimStatusModal
            ids={ids}
            campaignId={id}
            snsId={snsId}
            ClaimStat={ClaimStatus}
            onUpdateClaim={onUpdateClaim}
            setState={setState}
          />
        )}
        {selectedValue === 3 && (
          <ParticipantStatusModal
            participantStatus={participantStatus}
            setParticipantStatus={setParticipantStatus}
            onSelectWinner={onSelectWinner}
            campaignId={id}
            ids={ids}
            setState={setState}
            setEffectClear={setEffectClear}
            snsId={snsId}
          />
        )}
        {selectedValue === 6 && (
          <UploadCsvModal
            csvFile={csvFile}
            campaignId={id}
            setState={setState}
            snsId={snsId}
            onSubmit={onUploadCsv}
            errors={errors}
          />
        )}
        <SuccessMessageModal
          campDetails={campDetails}
          forceStopMessage={isForceStop}
          value={selectedValue}
          participantStatus={participantStatus}
          onSetData={onSetData}
          generateMessage={generateMessage}
          backfillMessage={backfillMessage}
          onClickOkSuccess={onClickOkSuccessEntry}
        />
        {failedEntries && (
          <FailedEntryModal
            onSetData={onSetData}
            failedEntries={failedEntries}
            checkedList={state.checkedList}
            userAccount={userAccount}
          />
        )}
        <FailedUploadCsvModal
          errors={errors}
          onResetUploadCsvFile={resetUploadCsvFile}
        />
        <LoseFlowModal
          value={selectedValue}
          ids={ids}
          onCancelWinner={onCancelWinner}
          cancelledWinner={cancelledWinner}
          onGenerateWinner={onGenerateWinner}
          showFlow={showFlow}
          campaignId={id}
          onResetData={onResetData}
          onSetData={onSetData}
          setEffectClear={setEffectClear}
          onGetCampDetails={onGetCampDetails}
          setState={setState}
          winner={winner}
          invalid={invalid}
          errors={errors}
          snsId={snsId}
          onCancelResetList={onCancelResetList}
        />
      </div>
      <div className="row justify-content-start mx-5">
        <div className="text-muted col-auto">
          {/* {intl.formatMessage({
            ...messages.show,
          })}
          <select className="p-1 mx-2">
            <option>10</option>
            <option>20</option>
            <option>30</option>
            <option>40</option>
            <option>50</option>
          </select>
          {intl.formatMessage({
            ...messages.entries,
          })} */}
          {isDownloading && (<h5 className="mt-2">{intl.formatMessage({ ...messages.downloadStarting })}</h5>)}
        </div>
      </div>
      <hr />
      <div className="row py-3">
        <div className="col-auto">
          <Button
            width="sm"
            tertiary
            small
            onClick={() => forwardTo('/campaign')}
          >
            {intl.formatMessage({
              ...messages.back,
            })}
          </Button>
        </div>
      </div>
      <Modal id="chooseAction" dismissable size="lg">
        <ModalToggler modalId="chooseAction" />
        <div className="row justify-content-center m-4">
          <div className="col-12 border d-flex">
            <Label className="col-2">
              {intl.formatMessage({
                ...messages.to,
              })}
            </Label>
            <Input secondary />
          </div>
          <div className="col-12 my-3 mr-0 pr-0 d-flex border">
            <Label className="col-2">
              {intl.formatMessage({
                ...messages.template,
              })}
            </Label>
            <Select className="border-0">
              <option>
                {intl.formatMessage({ id: 'M0000008' }, { name: 'Template' })}
              </option>
            </Select>
          </div>
          <div className="col-12 mb-3 border">
            <Textarea
              className="withHolder"
              placeholder="Message here"
              height={150}
              maxLength={200}
            />
          </div>
        </div>
        <div className="row mx-4">
          <div className="col-2 ml-auto mr-0">
            <Button tertiary small dataDismiss="modal">
              Back
            </Button>
          </div>
          <div className="col-2">
            <Button small dataDismiss="modal">
              Send
            </Button>
          </div>
        </div>
      </Modal>
      <GenerateNewWinner
        cancelledWinner={cancelledWinner}
        onGenerateWinner={onGenerateWinner}
        campaignId={id}
        onSetData={onSetData}
        winner={winner}
        invalid={invalid}
        errors={errors}
        snsId={snsId}
      />
    </div>
  );
}

EntryList.propTypes = {
  // theme: PropTypes.object,
  intl: intlShape.isRequired,
  detailPage: PropTypes.any,
  onGenerateWinner: PropTypes.any,
  onSelectWinner: PropTypes.any,
  onCancelWinner: PropTypes.any,
  onUpdateClaim: PropTypes.any,
  onSetData: PropTypes.any,
  onResetData: PropTypes.any,
  onPageWinner: PropTypes.any,
  onGetCampDetails: PropTypes.any,
  commonTypes: PropTypes.object,
  onDownload: PropTypes.func,
  id: PropTypes.number,
  filter: PropTypes.any,
  setFilter: PropTypes.func,
  orderBy: PropTypes.any,
  setOrderBy: PropTypes.func,
  statusList: PropTypes.any,
  statusList2: PropTypes.any,
  statusList3: PropTypes.any,
  isForceStop: PropTypes.any,
  prizeList: PropTypes.any,
  checkedList: PropTypes.any,
  onSendDM: PropTypes.any,
  userAccount: PropTypes.any,
  csv: PropTypes.any,
  onUploadCsv: PropTypes.any,
  csvFileUploaded: PropTypes.any,
  checkedParticipant: PropTypes.any,
  setCheckedParticipant: PropTypes.func,
  checkCondition: PropTypes.any,
  setCheckCondition: PropTypes.func,
  uncheckParticipant: PropTypes.any,
  setUncheckParticipant: PropTypes.func,
  backfillMessage: PropTypes.any,
  onClickOkSuccess: PropTypes.func,
  onCancelResetList: PropTypes.func,
  isDownloading: PropTypes.bool,
  setIsDownloading: PropTypes.func,
};

export default injectIntl(EntryList);
